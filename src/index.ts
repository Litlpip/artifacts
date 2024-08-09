import {characterNames} from './consts';
import {MapService} from './map/mapService';
import {CharacterService} from './characters/characterService';
import {PlanCrafter} from './plan/createPlan';
import {PlanLauncher} from './plan/launchPlan';

async function main() {
    const mapService = await MapService.create();
    const charactersServise = await CharacterService.create(characterNames, mapService);
    const planCrafter = new PlanCrafter(mapService);
    const planLauncher = new PlanLauncher();

    const man1plan = await planCrafter.createSimpleCraftPlan(charactersServise.get('man1'), 'iron', 'mining');
    const litlpipPlan = await planCrafter.createSimpleCraftPlan(charactersServise.get('Litlpip'), 'iron', 'mining');
    const man2plan = await planCrafter.createSimpleCraftPlan(
        charactersServise.get('man2'),
        'multislimes_sword',
        'weaponcrafting',
        false,
        5,
    );

    const man3plan = await planCrafter.createSimpleCraftPlan(
        charactersServise.get('man3'),
        'life_amulet',
        'jewelrycrafting',
        false,
        5,
    );
    const man4plan = await planCrafter.createSimpleCraftPlan(
        charactersServise.get('man4'),
        'cooked_gudgeon',
        'cooking',
    );
    planLauncher.runPlan(charactersServise.get('Litlpip'), litlpipPlan, true);
    planLauncher.runPlan(charactersServise.get('man1'), man1plan, true);
    planLauncher.runPlan(charactersServise.get('man2'), man2plan);
    planLauncher.runPlan(charactersServise.get('man3'), man3plan);
    planLauncher.runPlan(charactersServise.get('man4'), man4plan, true);

    // const cooperMiningPlan = await planCrafter.createGatherPlan('iron_rocks');
    // runPlan(charactersServise.get('man1'), cooperMiningPlan, true);
    // runPlan(charactersServise.get('Litlpip'), cooperMiningPlan, true);
    // runPlan(charactersServise.get('man2'), cooperMiningPlan, true);
    // runPlan(charactersServise.get('man4'), cooperMiningPlan, true);
    // runPlan(charactersServise.get('man3'), cooperMiningPlan, true);
}

main();
