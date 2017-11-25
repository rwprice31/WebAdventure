import { IMonsterResponse } from './../../../../shared/interfaces/responses/monsters/monster-response.interface';
import { MonsterService } from './../../monster.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../external-libraries/toastr.service';
import { UserService } from './../../user.service';
import { Observable } from 'rxjs/Rx';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { IMonsterViewModel } from '../../../../shared/interfaces/view-models/monsters/monster-view-model.interface';

/**
 * @class MonsterResolver
 * @description Resolver that provides a IMonsterResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class MonsterResolver implements Resolve<Observable<IMonsterResponse>> {

  private monsterId: number;

  constructor(private userService: UserService,
    private monsterService: MonsterService, 
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMonsterResponse> {
    this.monsterId = +route.params['id'];
    this.monsterService.setCurrentlyEdittingMonsterToSessionStorage(this.monsterId);
    // it's not a new game
    if (this.monsterId !== 0) {
      let monster: IMonsterViewModel = {
        monsterId: this.monsterId
      };
      return this.monsterService.getMonster(monster).map(
        (res: IMonsterResponse) => {
          // console.log('IMonstersResponse in resolver = ' + JSON.stringify(res));
          return res;
        }
      );
    }
    return null;
  }

}
