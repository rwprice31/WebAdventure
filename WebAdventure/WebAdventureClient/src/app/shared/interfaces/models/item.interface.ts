import { IItemType } from './item-type.interface';

export interface IItem {
    name: string;
    description: string;
    itemType: IItemType;
}
