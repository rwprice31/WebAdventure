import { IRoom } from './../../models/room.interface';
import { IResponse } from './../response.interface';

export interface IRoomUpdationResponse extends IResponse {
    room: IRoom;
}
