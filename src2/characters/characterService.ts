import {Character} from './characters';
import {artifactsApi} from '../consts';
import {CharacterName} from '../types';

export class CharacterService {
    private cache = new Map<CharacterName, Character>();

    constructor(list: Character[]) {
        list.forEach((item) => this.cache.set(item.name, item));
    }

    static async create(list: CharacterName[]) {
        const charList: Character[] = [];
        for (const item of list) {
            const char = await Character.create(item, artifactsApi);
            charList.push(char);
        }
        return new CharacterService(charList);
    }

    list(): Character[] {
        const list: Character[] = [];
        for (const value of this.cache.values()) {
            list.push(value);
        }
        return list;
    }

    public get(name: CharacterName) {
        return this.cache.get(name);
    }
}
