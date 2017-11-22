import { Injectable } from '@angular/core';

import { IItemTypesResponse } from '../../../../shared/interfaces/responses/items/item-type.response.interface';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ItemTypeService } from '../../item-type.service';



/**
 * @class UsersCreatedGamesResolver
 * @description Resolver that provides a IItemTypesResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class ItemTypesResolver implements Resolve<Observable<IItemTypesResponse>> {

  constructor(private itemTypeService: ItemTypeService) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IItemTypesResponse> {
      return this.itemTypeService.getItemTypes().map(
          (res: IItemTypesResponse) => {
            console.log('IItemTypesResponse in resolver = ' + JSON.stringify(res));
            return res;
          }
      );
  }

}
