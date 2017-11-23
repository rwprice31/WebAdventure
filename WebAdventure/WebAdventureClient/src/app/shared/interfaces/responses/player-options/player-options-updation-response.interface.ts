import { IResponse } from './../response.interface';
import { IPlayerOptions } from '../../models/player-options.interface';

export interface IPlayerOptionsUpdationResponse extends IResponse {
    player: IPlayerOptions;
}
