import { IRoom } from './room.interface';
import { IExits } from './exit.interface';
import { IMonster } from './monster.interface';
import { IItem } from './item.interface';

export interface IRoomInfo {
    room: IRoom,
    exits?: IExits[],
    monster?: IMonster,
    item?: IItem
}