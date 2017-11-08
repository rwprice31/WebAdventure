import { IGame } from './../../models/game.interface';;
import { IResponse } from './../response.interface';

export interface IGameResponse extends IResponse {
    game: IGame;
}
