import { IResponse } from './../response.interface';
import { IItem } from '../../models/item.interface';

export interface IItemCreationResponse extends IResponse {
    item: IItem;
}
