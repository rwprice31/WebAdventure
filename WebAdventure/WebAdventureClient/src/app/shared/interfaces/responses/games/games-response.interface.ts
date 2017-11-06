import { IGame } from './../../models/game.interface';;
import { IResponse } from './../response.interface';

export interface IGamesResponse extends IResponse {
    games: IGame[];
}
