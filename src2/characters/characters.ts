import {ArtifactsApi, ArtifactsError, GetCharacterApiResult} from 'artifacts-api-client';
import {delay} from '../../src/utils';
import {CharacterName} from '../types';

export class Character {
    constructor(
        readonly name: CharacterName,
        private readonly artifactsApi: ArtifactsApi,
        private characterInfo: GetCharacterApiResult['data'],
    ) {
        this.name = name;
        this.x = characterInfo.x;
        this.y = characterInfo.y;
    }

    x = 0;
    y = 0;

    static async create(name: CharacterName, artifactsApi: ArtifactsApi) {
        const {data} = await artifactsApi.characters.get(name);
        return new Character(name, artifactsApi, data);
    }

    public cooldownExpiration = new Date();

    public async moveAction(x: number, y: number): Promise<void> {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.move(this.name, {x, y});
        await this.refresh();
    }

    public async gatherAction(): Promise<void> {
        await this.waitCooldown();
        try {
            await this.artifactsApi.myCharacters.gathering(this.name);
        } catch (err) {
            if (err.code === 497) {
                console.log('err.code', err.code, err);
                this.moveAction(0, 0);
            }
        }
        await this.refresh();
    }

    public async fightAction(): Promise<void> {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.fight(this.name);
        await this.refresh();
    }

    public async depositItem(code: string, quantity: number): Promise<void> {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.depositBank(this.name, {code, quantity});
        await this.refresh();
    }

    public async depositAll(): Promise<void> {
        await this.waitCooldown();
        for (const item of this.characterInfo.inventory.filter((item) => item.quantity)) {
            await this.depositItem(item.code, item.quantity);
        }
        await this.refresh();
    }

    public async refresh(): Promise<void> {
        const {data} = await this.artifactsApi.characters.get(this.name);
        this.x = data.x;
        this.y = data.y;
        this.cooldownExpiration = new Date(data.cooldown_expiration);
        this.characterInfo = data;
    }

    private async waitCooldown(): Promise<void> {
        const nowDate = new Date();
        if (this.cooldownExpiration - nowDate > 0) await delay(this.cooldownExpiration - nowDate);
    }
}
