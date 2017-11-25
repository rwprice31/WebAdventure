import { IGame } from './game.interface';
//import { IMonsterAction } from "./monster-action.interface";

export interface IMonsters {
    id: number;
    descr: string;
    name: string;
    health: number;
    MinDamage: number;
    MaxDamage: number;
    Speed: number;
    AttackDescr: string;
    gameId: number;
    //actions?: IMonsterAction[]; 
}
