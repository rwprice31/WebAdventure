import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ItemTypeService } from '../../item-type.service';
import { ItemService } from '../../item.service';
import { IItemsResponse } from '../../../../shared/interfaces/responses/items/items-response.interface';

/**
 * @class ItemsResolver
 * @description Resolver that provides a IItemsResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class ItemsResolver implements Resolve<Observable<IItemsResponse>> {

  constructor(private itemService: ItemService) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IItemsResponse> {
      return this.itemService.getItems().map(
          (res: IItemsResponse) => {
            console.log('IItemsResponse in resolver = ' + JSON.stringify(res));  
            return res;
          }
      );
  }

}
