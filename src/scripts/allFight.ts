import {MapService} from '../map/mapService';
import {CharacterService} from '../characters/characterService';
import {characterNames} from '../consts';
import {PlanCrafter} from '../plan/createPlan';
import {PlanLauncher} from '../plan/launchPlan';
import {MapCode} from '../types';
import cluster from 'node:cluster';

async function main() {
    const mapService = await MapService.create();
    const charactersServise = await CharacterService.create(characterNames, mapService);
    const planCrafter = new PlanCrafter(mapService);
    const planLauncher = new PlanLauncher();

    // const man1 = charactersServise.get('man3');
    // const man1plan = await planCrafter.createSimpleCraftPlan(man1, 'slime_shield', 'gearcrafting', false, 5);
    //
    // planLauncher.runPlan(man1, man1plan);

    // const equip = async (argument) =>
    //     await planCrafter.createEquipPlan.apply(planCrafter, [['multislimes_sword'], argument]);
    //
    // const gather = () => planCrafter.createGatherPlan('coal_rocks');
    //

    // const craft = async (argument) =>
    //     await planCrafter.createSimpleCraftPlan.apply(planCrafter, [argument, 'spruce_plank', 'woodcutting']);
    const fight = (code: MapCode) => planCrafter.createFightPlan(code);
    planLauncher.runPlanForEachChar([charactersServise.get('Litlpip')], () => fight('yellow_slime'), true);

    planLauncher.runPlanForEachChar([charactersServise.get('man2')], () => fight('flying_serpent'), true);

    planLauncher.runPlanForEachChar(
        [charactersServise.get('man1'), charactersServise.get('man3'), charactersServise.get('man4')],
        () => fight('wolf'),
        true,
    );

    // const fight = (code: MapCode) => planCrafter.createFightPlan(code);
    // planLauncher.runPlanForEachChar(charactersServise.list(), () => fight('wolf'), true);
}

if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function (worker, code, signal) {
        cluster.fork();
    });
}

if (cluster.isWorker) {
    main();
}
