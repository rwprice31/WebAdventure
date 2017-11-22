import { IResponse } from './../response.interface';
import { IPlayerOptions } from '../../models/player-options.interface';

export interface IPlayerOptionsCreationResponse extends IResponse {
    playerOptions: IPlayerOptions;
}
