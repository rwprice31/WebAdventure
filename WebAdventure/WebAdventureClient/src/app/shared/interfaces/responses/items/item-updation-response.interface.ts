import { IResponse } from './../response.interface';
import { IItem } from '../../models/item.interface';

export interface IItemUpdationResponse extends IResponse {
    item: IItem;
}
