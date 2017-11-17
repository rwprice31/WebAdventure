import { IItemType } from '../../models/item-type.interface';

export interface IItemCreationViewModel {
    id: number;
    name: string;
    descr: string;
    type: IItemType;
    points: number;
}
