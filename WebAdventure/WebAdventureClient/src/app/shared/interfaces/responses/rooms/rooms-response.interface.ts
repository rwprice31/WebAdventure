import { IRoom } from './../../models/room.interface';
import { IResponse } from './../response.interface';

export interface IRoomsResponse extends IResponse {
    rooms: IRoom[];
}
