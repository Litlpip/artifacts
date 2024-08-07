import {Character} from '../characters/characters';
import {Action, Plan} from './types';

export async function runPlan(character: Character, plan: Plan[], isLooped: boolean = false) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        for (const step of plan) {
            //todo: выбирать близжайшую
            const closestMap = step.map[0];
            const isOnNeedMap = closestMap.x === character.x && closestMap.y === character.y;
            if (!isOnNeedMap) {
                console.log('Character ', character.name, ' going to move to x:', closestMap.x, ' y: ', closestMap.y);
                await character.move(closestMap);
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
            if (step.action === Action.depositAll) {
                await character.depositAll();
            }
        }
        if (!isLooped) return;
    }
}
