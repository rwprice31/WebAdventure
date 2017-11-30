import { IRoom } from './room.interface';

export interface IExit {
    id: number;
    currentRoomId: number;
    nextRoom: IRoom;
    descr: string;
    commands: string;
}
