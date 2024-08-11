import {ArtifactsApi, GetCharacterApiResult} from 'artifacts-api-client';
import {delay} from '../utils';
import {CharacterName} from '../types';
import {ArtifactMap, MapService} from '../map/mapService';
import {ItemSlot} from '../plan/types';
import {ArtifactsError} from 'artifacts-api-client/dist/errors/artifacts.error';

export class Character {
    constructor(
        readonly name: CharacterName,
        private readonly artifactsApi: ArtifactsApi,
        private characterInfo: GetCharacterApiResult['data'],
        private readonly mapService: MapService,
    ) {
        this.name = name;
        this.x = characterInfo.x;
        this.y = characterInfo.y;
        this.cooldownExpiration = new Date(characterInfo.cooldown_expiration);
    }

    private cooldownExpiration;
    x;
    y;

    get characterInfo() {
        return this.characterInfo;
    }

    static async create(name: CharacterName, artifactsApi: ArtifactsApi, mapService: MapService) {
        const {data} = await artifactsApi.characters.get(name);
        return new Character(name, artifactsApi, data, mapService);
    }

    public async move(map: ArtifactMap | ArtifactMap[]): Promise<void> {
        await this.waitCooldown();

        let destination: ArtifactMap;
        if (Array.isArray(map)) destination = map[0];
        else destination = map;

        if (destination.x !== this.characterInfo.x || destination.y !== this.characterInfo.y) {
            await this.artifactsApi.myCharacters.move(this.name, {x: destination.x, y: destination.y});
        }
        await this.refresh();
    }

    public async gather(needDeposit): Promise<void> {
        await this.waitCooldown();
        try {
            await this.artifactsApi.myCharacters.gathering(this.name);
        } catch (err) {
            if (err.code === 497 && needDeposit) {
                console.log('err.code', err.code, err);
                await this.move(this.mapService.get('bank'));
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
        if (this.characterInfo.task_progress === this.characterInfo.task_total) {
            const taskMaster = this.mapService.get('monsters');
            await this.move(taskMaster);
            await this.completeQuest();
            await this.takeQuest();
        }
    }

    public async depositItem(code: string, quantity: number): Promise<void> {
        await this.waitCooldown();
        try {
            await this.artifactsApi.myCharacters.depositBank(this.name, {code, quantity});
        } catch (err) {
            if (err instanceof ArtifactsError && err.code === 461) {
                console.log('Transaction with this item during deposit is in progress');
                await delay(500);
                await this.depositItem(code, quantity);
            }
            console.log('Deposit error', err);
        }
        await this.refresh();
    }

    public async depositAll(): Promise<void> {
        const bank = this.mapService.get('bank');
        await this.move(bank);
        const inventory = this.characterInfo.inventory.filter((item) => item.quantity);
        if (inventory.length) {
            for (const item of this.characterInfo.inventory.filter((item) => item.quantity)) {
                await this.depositItem(item.code, item.quantity);
            }
        }
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

    async withdraw(code: string, quantity: number): Promise<void> {
        await this.waitCooldown();
        try {
            await this.artifactsApi.myCharacters.withdrawBank(this.name, {quantity, code});
        } catch (err) {
            if (err instanceof ArtifactsError && err.code === 461) {
                console.log('Transaction with this item during withdraw is in progress');
                await delay(500);
                await this.withdraw(code, quantity);
            }
            console.log('Withdraw error', err);
        }
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

    async equip(code: string, slot: ItemSlot) {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.equipItem(this.name, {code, slot});
        await this.refresh();
    }

    async unequip(slot: ItemSlot) {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.unequipItem(this.name, {slot});
        await this.refresh();
    }

    async completeQuest() {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.completeTask(this.name);
        await this.refresh();
    }

    async takeQuest() {
        await this.waitCooldown();
        await this.artifactsApi.myCharacters.acceptTask(this.name);
        await this.refresh();
    }
}
