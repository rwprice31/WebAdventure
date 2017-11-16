import { IResponse } from './../response.interface';
import { IItem } from '../../models/item.interface';

export interface IItemResponse extends IResponse {
    item: IItem;
}
