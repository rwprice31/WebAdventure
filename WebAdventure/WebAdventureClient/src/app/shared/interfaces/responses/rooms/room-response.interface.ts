import { IRoom } from './../../models/room.interface';
import { IResponse } from './../response.interface';

export interface IRoomResponse extends IResponse {
    rooms: IRoom;
}
