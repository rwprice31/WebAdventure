import { IRoom } from './room.interface';
import { IItem } from './item.interface';

export interface IOutcome {
    id: number;
    // monster: IMonster;
    room: IRoom;
    item: IItem;
}
