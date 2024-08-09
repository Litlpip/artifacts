import {MapService} from '../map/mapService';
import {CharacterService} from '../characters/characterService';
import {characterNames} from '../consts';
import {PlanCrafter} from '../plan/createPlan';
import {PlanLauncher} from '../plan/launchPlan';

async function main() {
    const mapService = await MapService.create();
    const charactersServise = await CharacterService.create(characterNames, mapService);
    const planCrafter = new PlanCrafter(mapService);
    const planLauncher = new PlanLauncher();
    const craft = async (argument) =>
        await planCrafter.createSimpleCraftPlan.apply(planCrafter, [argument, 'spruce_plank', 'woodcutting']);

    // const person = charactersServise.get('man3');

    planLauncher.runPlanForEachChar(charactersServise.list(), craft, false);
}

main();
