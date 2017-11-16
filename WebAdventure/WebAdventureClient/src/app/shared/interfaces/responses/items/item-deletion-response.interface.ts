import { IResponse } from './../response.interface';
import { IItem } from '../../models/item.interface';

export interface IItemDeletionResponse extends IResponse {
    item: IItem;
}
