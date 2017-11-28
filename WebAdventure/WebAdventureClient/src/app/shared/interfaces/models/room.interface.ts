import { IRoomAction } from './room-action.interface';
import { IGame } from './game.interface';

export interface IRoom {
    id: number;
    name: string;
    descr: string;
    gameId: number;
    isStarting?: boolean,
    actions?: IRoomAction[];
}
