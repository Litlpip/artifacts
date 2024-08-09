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

    const person = charactersServise.get('man2');
    const plan1 = await planCrafter.createSimpleCraftPlan(person, 'mushstaff', 'weaponcrafting', false, 5);
    // const plan2 = await planCrafter.createSimpleCraftPlan(person, 'iron_armor', 'gearcrafting', false, 5);
    // const plan3 = await planCrafter.createSimpleCraftPlan(person, 'iron_boots', 'gearcrafting', false, 5);
    // const plan4 = await planCrafter.createSimpleCraftPlan(person, 'iron_ring', 'jewelrycrafting', false, 5);

    await planLauncher.runPlan(person, plan1, false);
    // await planLauncher.runPlan(person, plan2, false);
    // await planLauncher.runPlan(person, plan3, false);
    // await planLauncher.runPlan(person, plan4, false);
}

main();
