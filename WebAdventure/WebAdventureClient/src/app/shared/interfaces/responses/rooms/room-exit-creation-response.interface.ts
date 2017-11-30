import { IRoom } from './../../models/room.interface';
import { IResponse } from './../response.interface';
import { IExit } from '../../models/exit.interface';

export interface IRoomExitCreationResponse extends IResponse {
    exits: IExit[];
}
