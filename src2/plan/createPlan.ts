import {MapService} from '../map/mapService';
import {
    Action,
    Plan,
    PlanCraft,
    PlanDepositAll,
    PlanFight,
    PlanGather,
    PlanRecycle,
    PlanWithdraw,
    RecipeCraftItem,
} from './types';
import {MapCode} from '../types';
import {artifactsApi} from '../consts';
import {Character} from '../characters/characters';

export class PlanCrafter {
    constructor(private readonly mapService: MapService) {}

    // Крафт без вложенных крафтов
    public async createSimpleCraftPlan(
        character: Character,
        code: string,
        mapCode: MapCode,
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

        //взять сколько надо ресок

        console.log('plan', plan);

        return plan;
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

    //Вернуть массив вещей которые надо взять и их количество
    private async getPickList(
        character: Character,
        code: string,
        quantity: number = undefined,
    ): Promise<{list: RecipeCraftItem[]; amount: number}> {
        const {data} = await artifactsApi.items.get(code);

        const craftRecipe = data.item.craft.items;

        //Если было указано количество, которое надо скрафтить, то вернем рецепт с перемноженным quantity
        if (quantity) {
            const list = craftRecipe.map((item) => ({code: item.code, quantity: item.quantity * quantity}));
            return {list, amount: quantity};
        }
        const characterMaxItems = character.characterInfo.inventory_max_items;
        console.log('characterMaxItems', characterMaxItems);

        const itemsCountForOneCraft = craftRecipe.reduce((acc, item) => acc + item.quantity, 0);

        const multiplier = Math.floor(characterMaxItems / itemsCountForOneCraft);

        // Иначе возвращаем такой список вещей, чтобы он максимально забил инвентарь
        const list = craftRecipe.map((item) => ({code: item.code, quantity: item.quantity * multiplier}));
        return {list, amount: multiplier};
    }
}
