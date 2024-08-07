import {ArtifactMap} from '../map/mapService';

export type Plan = PlanFight | PlanGather | PlanDepositAll | PlanWithdraw | PlanRecycle | PlanCraft;

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

export enum Action {
    gather,
    fight,
    depositAll,
    withdraw,
    recycle,
    craft,
}

export interface RecipeCraftItem {
    code: string;
    quantity: number;
}
