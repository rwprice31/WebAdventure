import { IGame } from './game.interface';
import { IMonsterAction } from "./monster-action.interface";

export interface IMonsters {
    id: number;
    name: string;
    descr: string;  
    health: number;
    minDamage: number;
    maxDamage: number;
    speed: number;
    attackDescr: string;
    gameId: number;
   // actions?: IMonsterAction[]; 
}
