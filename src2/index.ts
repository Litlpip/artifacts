import {characterNames} from './consts';
import {MapService} from './map/mapService';
import {CharacterService} from './characters/characterService';
import {PlanCrafter} from './plan/createPlan';
import {runPlan} from './plan';

async function main() {
    const mapService = await MapService.create();
    const charactersServise = await CharacterService.create(characterNames, mapService);
    const planCrafter = new PlanCrafter(mapService);
    const man1plan = await planCrafter.createSimpleCraftPlan(charactersServise.get('man1'), 'iron', 'mining');
    const litlpipPlan = await planCrafter.createSimpleCraftPlan(charactersServise.get('Litlpip'), 'iron', 'mining');
    runPlan(charactersServise.get('man1'), man1plan, true);
    runPlan(charactersServise.get('Litlpip'), litlpipPlan, true);
}

main();
