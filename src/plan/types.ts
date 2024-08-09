import {ArtifactMap} from '../map/mapService';
import {EquipItemApiBody} from 'artifacts-api-client/dist/api/types/api-schema-bindings.types';

export type Plan =
    | PlanFight
    | PlanGather
    | PlanDepositAll
    | PlanWithdraw
    | PlanRecycle
    | PlanCraft
    | PlanEquip
    | PlanUnequip;

export interface PlanGather {
    action: Action.gather;
    map: ArtifactMap[];
}

export interface PlanFight {
    action: Action.fight;
    map: ArtifactMap[];
}

export interface PlanDepositAll {
    action: Action.depositAll;
    map: ArtifactMap[];
}

export interface PlanWithdraw {
    action: Action.withdraw;
    map: ArtifactMap[];
    code: string;
    quantity: number;
}

export interface PlanRecycle {
    action: Action.recycle;
    map: ArtifactMap[];
    code: string;
    quantity: number;
}

export interface PlanCraft {
    action: Action.craft;
    map: ArtifactMap[];
    code: string;
    desireQuantity: number;
}

export interface PlanEquip {
    action: Action.equip;
    code: string;
    slot: ItemSlot;
}

export interface PlanUnequip {
    action: Action.unequip;
    slot: ItemSlot;
}

export enum Action {
    gather,
    fight,
    depositAll,
    withdraw,
    recycle,
    craft,
    equip,
    unequip,
}

export interface RecipeCraftItem {
    code: string;
    quantity: number;
}

// export type ItemSlot =
//     | 'weapon_slot'
//     | 'shield_slot'
//     | 'helmet_slot'
//     | 'body_armor_slot'
//     | 'leg_armor_slot'
//     | 'boots_slot'
//     | 'ring1_slot'
//     | 'ring2_slot'
//     | 'amulet_slot'
//     | 'artifact1_slot'
//     | 'artifact2_slot'
//     | 'artifact3_slot'
//     | 'consumable1_slot'
//     | 'consumable2';

export type ItemSlot = EquipItemApiBody['slot'];
