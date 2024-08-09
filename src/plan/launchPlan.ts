import {Character} from '../characters/characters';
import {Action, Plan} from './types';

export class PlanLauncher {
    constructor() {}

    public getPlanFabric(args) {
        return;
    }

    public async runPlan(character: Character, plan: Plan[], isLooped: boolean = false) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            for (const step of plan) {
                if ('map' in step) {
                    //todo: выбирать близжайшую
                    const closestMap = step.map[0];
                    const isOnNeedMap = closestMap.x === character.x && closestMap.y === character.y;
                    if (!isOnNeedMap) {
                        console.log(
                            'Character ',
                            character.name,
                            ' going to move to x:',
                            closestMap.x,
                            ' y: ',
                            closestMap.y,
                        );
                        await character.move(closestMap);
                    }
                }

                if (step.action === Action.gather) {
                    await character.gather(isLooped);
                }
                if (step.action === Action.fight) {
                    await character.fight(isLooped);
                }
                if (step.action === Action.withdraw) {
                    await character.withdraw(step.code, step.quantity);
                }
                if (step.action === Action.recycle) {
                    await character.recycle(step.code, step.quantity);
                }
                if (step.action === Action.craft) {
                    await character.craft(step.code, step.desireQuantity);
                }
                if (step.action == Action.unequip) {
                    await character.unequip(step.slot);
                }
                if (step.action == Action.equip) {
                    await character.equip(step.code, step.slot);
                }
                if (step.action === Action.depositAll) {
                    await character.depositAll();
                }
            }
            if (!isLooped) return;
        }
    }

    public async runPlanForEachChar(charList: Character[], planCrafter, isLooped: boolean = false) {
        for (const char of charList) {
            const plan = await planCrafter(char);
            console.log('plan', plan);
            this.runPlan(char, plan, isLooped);
        }
    }
}
