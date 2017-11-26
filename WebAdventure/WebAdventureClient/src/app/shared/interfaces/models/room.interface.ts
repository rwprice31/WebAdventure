import { IGame } from './game.interface';
import { IActionOutcome } from './action-outcome.interface';

export interface IRoom {
    id: number;
    name: string;
    descr: string;
    gameId: number;
    actionOutcomes: IActionOutcome[];
}
