import { IRoom } from './room.interface';
import { IExit } from './exit.interface';
import { IMonster } from './monster.interface';
import { IItem } from './item.interface';

export interface IRoomInfo {
    room: IRoom;
    exits?: IExit[];
    monster?: IMonster;
    item?: IItem;
}
