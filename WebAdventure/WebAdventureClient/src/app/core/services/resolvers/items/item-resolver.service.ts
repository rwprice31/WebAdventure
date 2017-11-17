import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ItemTypeService } from '../../item-type.service';
import { ItemService } from '../../item.service';
import { IItemsResponse } from '../../../../shared/interfaces/responses/items/items-response.interface';
import { IItemResponse } from '../../../../shared/interfaces/responses/items/item-response.interface';
import { IItemViewModel } from '../../../../shared/interfaces/view-models/items/item-view-model.interface';

/**
 * @class ItemResolver
 * @description Resolver that provides a IItemTypesResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class ItemResolver implements Resolve<Observable<IItemResponse>> {

    private itemId: number;

    constructor(private itemService: ItemService) {

    }
 
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IItemResponse> {
        this.itemId = +route.params['id'];
        this.itemService.setCurrentlyEdittingItemToSessionStorage(this.itemId);
        // it's not a new item
        if (this.itemId !== 0) {
        let item: IItemViewModel = {
            itemId: this.itemId
        };
        return this.itemService.getItem(item).map(
            (res: IItemResponse) => {
            console.log('IItemResponse in resolver = ' + JSON.stringify(res));
            return res;
            }
        );
        }
        return null;
    }

}
