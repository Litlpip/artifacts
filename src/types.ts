import {GetMapApiResult} from 'artifacts-api-client';

export type CharacterName = 'Litlpip' | 'man1' | 'man2' | 'man3' | 'man4';

export type MapContentType = 'resource' | 'monster' | 'workshop' | 'bank' | 'grand_exchange' | 'tasks_master';

export type ArtifactsMapData = GetMapApiResult['data'];
type B = NonNullableFields<ArtifactsMapData['content']>;

export type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};

const a: B = {
    content: null,
    x: 1,
    y: 2,
    name: '123',
    skin: '123',
};

console.log(a);

//Manually picked
export type MapCode = ResourceCode | MonsterCode | WorkshopCode | CodeBank | GrandExchangeCode | TaskMasterCode;

type ResourceCode =
    | 'gold_rocks'
    | 'ash_tree'
    | 'copper_rocks'
    | 'gudgeon_fishing_spot'
    | 'shrimp_fishing_spot'
    | 'spruce_tree'
    | 'bass_fishing_spot'
    | 'trout_fishing_spot'
    | 'birch_tree'
    | 'coal_rocks'
    | 'iron_rocks'
    | 'dead_tree';

type MonsterCode =
    | 'ogre'
    | 'pig'
    | 'blue_slime'
    | 'yellow_slime'
    | 'red_slime'
    | 'green_slime'
    | 'wolf'
    | 'chicken'
    | 'cow'
    | 'owlbear'
    | 'mushmush'
    | 'flying_serpent'
    | 'lich'
    | 'death_knight'
    | 'skeleton'
    | 'vampire';

type WorkshopCode = 'woodcutting' | 'cooking' | 'weaponcrafting' | 'gearcrafting' | 'jewelrycrafting' | 'mining';

type CodeBank = 'bank';

type GrandExchangeCode = 'grand_exchange';

type TaskMasterCode = 'monsters';
