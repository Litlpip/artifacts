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

    const person = charactersServise.get('man4');
    const plan = await planCrafter.createSimpleCraftPlan(person, 'cooked_shrimp', 'cooking');

    await planLauncher.runPlan(person, plan, true);
}

main();
