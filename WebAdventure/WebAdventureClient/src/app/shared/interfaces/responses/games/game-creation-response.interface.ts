import { IGame } from './../../models/game.interface';
import { IResponse } from './../response.interface';

export interface IGameCreationResponse extends IResponse {
    game: IGame;
}
