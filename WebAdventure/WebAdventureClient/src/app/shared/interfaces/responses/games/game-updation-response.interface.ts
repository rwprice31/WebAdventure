import { IGame } from './../../models/game.interface';;
import { IResponse } from './../response.interface';

export interface IGameUpdationResponse extends IResponse {
    game: IGame;
}
