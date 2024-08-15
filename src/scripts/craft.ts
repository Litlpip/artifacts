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

    const person = charactersServise.get('man3');
    const plan1 = await planCrafter.createSimpleCraftPlan(person, 'adventurer_vest', 'gearcrafting', true);
    // const plan2 = await planCrafter.createSimpleCraftPlan(person, 'life_ring', 'jewelrycrafting', false, 10);
    // const plan3 = await planCrafter.createSimpleCraftPlan(person, 'iron_boots', 'gearcrafting', false, 5);
    // const plan4 = await planCrafter.createSimpleCraftPlan(person, 'iron_ring', 'jewelrycrafting', false, 5);

    await planLauncher.runPlan(person, plan1, true);
    // await planLauncher.runPlan(person, plan2, false);
    // await planLauncher.runPlan(person, plan3, false);
    // await planLauncher.runPlan(person, plan4, false);
}

main();
// if (cluster.isMaster) {
//     cluster.fork();
//
//     cluster.on('exit', function (worker, code, signal) {
//         console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code);
//         cluster.fork();
//     });
// }
//
// if (cluster.isWorker) {
//     main();
// }
