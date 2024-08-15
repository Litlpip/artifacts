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

    planLauncher.runPlanForEachChar(charactersServise.list(), planCrafter.createFightPlan, ['skeleton'], true);

    // planLauncher.runPlanForEachChar(charactersServise.list(['man3']), () => fight('green_slime'), true);

    // planLauncher.runPlanForEachChar(charactersServise.list(['Litlpip']), () => fight('cow'), [], true);
}

if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code);
        cluster.fork();
    });
}

if (cluster.isWorker) {
    main();
}
