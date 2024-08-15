import {MapService} from '../map/mapService';
import {CharacterService} from '../characters/characterService';
import {characterNames} from '../consts';
import {PlanCrafter} from '../plan/createPlan';
import {PlanLauncher} from '../plan/launchPlan';
import cluster from 'node:cluster';

async function main() {
    const mapService = await MapService.create();
    const charactersServise = await CharacterService.create(
        characterNames,
        mapService,
    );
    const planCrafter = new PlanCrafter(mapService);
    const planLauncher = new PlanLauncher();

    planLauncher.runPlanForEachChar(
        charactersServise.list(['man1', 'Litlpip', 'man2', 'man3', 'man4']),
        planCrafter.createGatherPlan,
        ['coal_rocks'],
        true,
    );

    // const fight = (code: MapCode) => planCrafter.createFightPlan(code);
    // planLauncher.runPlanForEachChar(charactersServise.list(), () => fight('wolf'), true);
}

if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function (worker, code, signal) {
        console.log(
            'worker %d died (%s). restarting...',
            worker.process.pid,
            signal || code,
        );
        cluster.fork();
    });
}

if (cluster.isWorker) {
    main();
}
