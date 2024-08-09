import {MapService} from '../map/mapService';
import {
    Action,
    ItemSlot,
    Plan,
    PlanCraft,
    PlanDepositAll,
    PlanEquip,
    PlanFight,
    PlanGather,
    PlanRecycle,
    PlanUnequip,
    PlanWithdraw,
    RecipeCraftItem,
} from './types';
import {MapCode} from '../types';
import {artifactsApi} from '../consts';
import {Character} from '../characters/characters';

export class PlanCrafter {
    //Ни в коем случае
    constructor(private readonly mapService: MapService) {}

    // Крафт без вложенных крафтов
    public async createSimpleCraftPlan(
        character: Character,
        code: string,
        mapCode: MapCode,
        needRecycle: boolean = false,
        quantity: number = undefined,
    ): Promise<Plan[]> {
        //сложить
        const plan: Plan[] = [this.getDepositAllPlan()];
        // const bank = this.mapService.get('bank');

        const {list, amount} = await this.getPickList(character, code, quantity);

        // Добавили планы на получение нужных итемов из банка
        for (const pickListItem of list) {
            plan.push(this.getWithdrawPlan(pickListItem.code, pickListItem.quantity));
        }

        //План скрафтить шмотку
        const craftPlan = this.getCraftPlan(mapCode, code, amount);

        plan.push(craftPlan);

        if (needRecycle) plan.push(this.getRecyclePlan(mapCode, code, amount));

        //взять сколько надо ресок

        plan.push(this.getDepositAllPlan());

        return plan;
    }

    // Возвращает план как сменить вещи
    public async createEquipPlan(itemsCode: string[], character: Character) {
        // Надо что то придумать с кольцами
        // Складываем все на всякий случай
        const plan: Plan[] = [this.getDepositAllPlan()];

        const newItemsToEquip = await this.getOnlyNewItemsToEquip(itemsCode, character);

        //Взять нужные шмотки
        for (const item of newItemsToEquip) {
            plan.push(this.getWithdrawPlan(item.code, 1));
        }

        // Посмотреть что за итем
        for (const item of newItemsToEquip) {
            const {data} = await artifactsApi.items.get(item.code);

            if (character.characterInfo[`${item.itemType}_slot`])
                plan.push(this.getUnequipPlan(data.item.type as ItemSlot));
        }

        for (const item of newItemsToEquip) {
            // const {data} = await artifactsApi.items.get(code);

            plan.push(this.getEquipPlan(item.itemType, item.code));
        }

        plan.push(this.getDepositAllPlan());

        console.log(plan);

        return plan;
    }

    public async createGatherPlan(mapCode: MapCode) {
        return [this.getGatherPlan(mapCode)];
    }

    public async createFightPlan(mapCode: MapCode) {
        return [this.getFightPlan(mapCode)];
    }

    public async createDepositAllPlan() {
        return [this.getDepositAllPlan()];
    }

    private getDepositAllPlan(): PlanDepositAll {
        const bank = this.mapService.get('bank');
        return {action: Action.depositAll, map: bank};
    }

    private getWithdrawPlan(code: string, quantity: number): PlanWithdraw {
        const bank = this.mapService.get('bank');
        return {action: Action.withdraw, map: bank, code, quantity};
    }

    private getGatherPlan(mapCode: MapCode): PlanGather {
        return {action: Action.gather, map: this.mapService.get(mapCode)};
    }

    private getFightPlan(mapCode: MapCode): PlanFight {
        return {action: Action.fight, map: this.mapService.get(mapCode)};
    }

    private getRecyclePlan(mapCode: MapCode, code: string, quantity: number): PlanRecycle {
        return {action: Action.recycle, map: this.mapService.get(mapCode), code, quantity};
    }

    private getCraftPlan(mapCode: MapCode, code: string, quantity: number): PlanCraft {
        return {action: Action.craft, map: this.mapService.get(mapCode), code, desireQuantity: quantity};
    }

    private getEquipPlan(slot: ItemSlot, code: string): PlanEquip {
        return {action: Action.equip, slot, code};
    }

    private getUnequipPlan(slot: ItemSlot): PlanUnequip {
        return {action: Action.unequip, slot};
    }

    //Вернуть массив вещей которые надо взять и их количество
    private async getPickList(
        character: Character,
        code: string,
        quantity: number = undefined,
    ): Promise<{list: RecipeCraftItem[]; amount: number}> {
        const {data} = await artifactsApi.items.get(code);

        const craftRecipe = data.item.craft?.items;
        if (!craftRecipe) {
            throw new Error(`CraftRecipe is ${craftRecipe}`);
        }

        //Если было указано количество, которое надо скрафтить, то вернем рецепт с перемноженным quantity
        if (quantity) {
            const list = craftRecipe.map((item) => ({code: item.code, quantity: item.quantity * quantity}));
            return {list, amount: quantity};
        }
        const characterMaxItems = character.characterInfo.inventory_max_items;

        const itemsCountForOneCraft = craftRecipe.reduce((acc, item) => acc + item.quantity, 0);

        const multiplier = Math.floor(characterMaxItems / itemsCountForOneCraft);

        // Иначе возвращаем такой список вещей, чтобы он максимально забил инвентарь
        const list = craftRecipe.map((item) => ({code: item.code, quantity: item.quantity * multiplier}));
        return {list, amount: multiplier};
    }

    private async getOnlyNewItemsToEquip(
        codeList: string[],
        character: Character,
    ): Promise<
        Array<{
            code: string;
            itemType: ItemSlot;
        }>
    > {
        const result: {code: string; itemType: ItemSlot}[] = [];
        for (const code of codeList) {
            const {data} = await artifactsApi.items.get(code);
            if (character.characterInfo[`${data.item.type}_slot`] !== code) {
                result.push({code, itemType: data.item.type as ItemSlot});
            }
        }
        return result;
    }
}
