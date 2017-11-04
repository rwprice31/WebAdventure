import { IGame } from './../../models/game.interface';
import { IResponse } from './../response.interface';

export interface IUsersGameResponse extends IResponse {
    games: IGame[];
}
