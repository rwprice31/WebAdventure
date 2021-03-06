import { IRoom } from './../../models/room.interface';
import { IResponse } from './../response.interface';

export interface IRoomDeletionResponse extends IResponse {
    rooms: IRoom[];
}
