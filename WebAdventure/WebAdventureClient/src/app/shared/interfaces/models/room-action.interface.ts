import { IGame } from './game.interface';
import { IAction } from './action.interface';

export interface IRoomAction {
    id: number;
    action: IAction;
    game: IGame;
}
