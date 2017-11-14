import { IRoom } from '../../models/room.interface';

export interface IRoomUpdationViewModel {
    id: number;
    name: string;
    descr: string;
    gameId: number;
}
