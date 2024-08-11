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
    const person = charactersServise.get('man2');

    const plan = await planCrafter.createEquipPlan(person, ['iron_ring']);

    planLauncher.runPlan(person, plan);
}

console.log('launched');
// main();

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
