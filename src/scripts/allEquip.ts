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

    const equip = async (argument) =>
        await planCrafter.createEquipPlan.apply(planCrafter, [
            ['mushstaff', 'iron_armor', 'iron_legs_armor', 'slime_shield'],
            argument,
        ]);

    planLauncher.runPlanForEachChar(charactersServise.list(), equip);
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
