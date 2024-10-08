import {Character} from './characters';
import {artifactsApi} from '../consts';
import {CharacterName} from '../types';
import {MapService} from '../map/mapService';

export class CharacterService {
    private cache = new Map<CharacterName, Character>();

    constructor(list: Character[]) {
        list.forEach((item) => this.cache.set(item.name, item));
    }

    static async create(list: CharacterName[], mapService: MapService) {
        const charList: Character[] = [];
        for (const item of list) {
            const char = await Character.create(item, artifactsApi, mapService);
            charList.push(char);
        }
        return new CharacterService(charList);
    }

    list(charList?: CharacterName[]): Character[] {
        const list: Character[] = [];
        if (charList) {
            charList.forEach((name) => list.push(this.get(name)));
        } else {
            for (const value of this.cache.values()) {
                list.push(value);
            }
        }
        return list;
    }

    public get(name: CharacterName): Character {
        return <Character>this.cache.get(name);
    }
}
