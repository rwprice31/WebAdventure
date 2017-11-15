import { IRoom } from './../../models/room.interface';
import { IResponse } from './../response.interface';

export interface IRoomCreationResponse extends IResponse {
    room: IRoom;
}
