import {MapService} from '../map/mapService';
import {CharacterService} from '../characters/characterService';
import {characterNames} from '../consts';
import {PlanCrafter} from '../plan/createPlan';
import {PlanLauncher} from '../plan/launchPlan';
import cluster from 'node:cluster';

async function main() {
    const mapService = await MapService.create();
    const charactersServise = await CharacterService.create(characterNames, mapService);
    const planCrafter = new PlanCrafter(mapService);
    const planLauncher = new PlanLauncher();

    const person = charactersServise.get('man4');
    const plan = await planCrafter.createSimpleCraftPlan(person, 'cooked_shrimp', 'cooking');

    await planLauncher.runPlan(person, plan, true);
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
