import { IResponse } from './../response.interface';
import { IItem } from '../../models/item.interface';

export interface IItemsResponse extends IResponse {
    items: IItem[];
}
