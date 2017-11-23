import { IResponse } from './../response.interface';
import { IPlayerOptions } from '../../models/player-options.interface';

export interface IPlayerOptionsResponse extends IResponse {
    player: IPlayerOptions;
}
