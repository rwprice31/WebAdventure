import { IResponse } from './../response.interface';
import { IItemType } from '../../models/item-type.interface';

export interface IItemTypesResponse extends IResponse {
    itemTypes: IItemType[];
}
