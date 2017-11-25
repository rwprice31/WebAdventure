import { MonsterService } from './../../monster.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../external-libraries/toastr.service';
import { UserService } from './../../user.service';
import { IMonstersResponse } from './../../../../shared/interfaces/responses/monsters/monsters-response.interface';
import { Observable } from 'rxjs/Rx';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, Inject } from '@angular/core';

/**
 * @class MonstersResolver
 * @description Resolver that provides a IMonstersResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class MonstersResolver implements Resolve<Observable<IMonstersResponse>> {

  constructor(private userService: UserService,
    private monsterService: MonsterService, 
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMonstersResponse> {
    return this.monsterService.getMonsters().map(
        (res: IMonstersResponse) => {
            // console.log('Monsters response in resolve = ' + res);
            return res;
        }
    );
  }

}
