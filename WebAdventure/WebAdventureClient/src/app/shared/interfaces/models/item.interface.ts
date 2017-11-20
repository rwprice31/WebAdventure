import { IItemType } from './item-type.interface';

export interface IItem {
    id: number;
    name: string;
    descr: string;
    type: IItemType;
    points: number;
}
