import { IItemType } from '../../models/item-type.interface';

export interface IItemUpdationViewModel {
    id: number;
    name: string;
    descr: string;
    type: IItemType;
    points: number;
}
