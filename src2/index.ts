import {characterNames} from './consts';
import {MapService} from './map/mapService';
import {CharacterService} from './characters/characterService';

async function main() {
    const mapService = await MapService.create();
    const charactersServise = await CharacterService.create(characterNames);
    const map = mapService.get('iron_rocks');
    await charactersServise.get('man1').moveAction(map.x, map.y);
}

main();
