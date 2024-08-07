import {ArtifactsApi, GetCharacterApiResult} from 'artifacts-api-client';
import {delay} from '../../src/utils';
import {CharacterName} from '../types';
import {ArtifactMap} from '../map/mapService';

export class Character {
    constructor(
        readonly name: CharacterName,
        private readonly artifactsApi: ArtifactsApi,
        private characterInfo: GetCharacterApiResult['data'],
    ) {
        this.name = name;
        this.x = characterInfo.x;
        this.y = characterInfo.y;
        this.cooldownExpiration = new Date(characterInfo.cooldown_expiration);
    }

    private cooldownExpiration = new Date();

    get characterInfo() {
        return this.characterInfo;
    }

    x = 0;
    y = 0;

    static async create(name: CharacterName, artifactsApi: ArtifactsApi) {
        const {data} = await artifactsApi.characters.get(name);
        return new Character(name, artifactsApi, data);
    }

    public async move(map: ArtifactMap | ArtifactMap[]): Promise<void> {
        await this.waitCooldown();

        let destination: ArtifactMap;
        if (Array.isArray(map)) destination = map[0];
        else destination = map;

        await this.artifactsApi.myCharacters.move(this.name, {x: destination.x, y: destination.y});
        await this.refresh();
    }

    public async gather(needDeposit): Promise<void> {
        await this.waitCooldown();
        try {
            await this.artifactsApi.myCharacters.gathering(this.name);
        } catch (err) {
            if (err.code === 497 && needDeposit) {
                console.log('err.code', err.code, err);
                await this.depositAll();
            }
            console.log('Gather error', err?.message);
        }
        await this.refresh();
    }

    public async fight(needDeposit): Promise<void> {
        await this.waitCooldown();
        try {
            await this.artifactsApi.myCharacters.fight(this.name);
        } catch (err) {
            if (err.code === 497 && needDeposit) {
                console.log('err.code', err.code, err);
                await this.depositAll();
            }
            console.log('Fight error', err?.message);
        }
        await this.refresh();
    }

    public async depositItem(code: string, quantity: number): Promise<void> {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.depositBank(this.name, {code, quantity});
        await this.refresh();
    }

    public async depositAll(): Promise<void> {
        await this.waitCooldown();

        const inventory = this.characterInfo.inventory.filter((item) => item.quantity);
        if (inventory.length) {
            for (const item of this.characterInfo.inventory.filter((item) => item.quantity)) {
                await this.depositItem(item.code, item.quantity);
            }
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
        console.log('this.cooldownExpiration - nowDate', this.cooldownExpiration - nowDate);
        if (this.cooldownExpiration - nowDate > 0) await delay(this.cooldownExpiration - nowDate);
    }

    async withdraw(code: string, quantity: number): Promise<void> {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.withdrawBank(this.name, {quantity, code});
        await this.refresh();
    }

    async recycle(code: string, quantity: number): Promise<void> {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.recycling(this.name, {quantity, code});
        await this.refresh();
    }

    async craft(code: string, quantity: number): Promise<void> {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.crafting(this.name, {quantity, code});
        await this.refresh();
    }
}
