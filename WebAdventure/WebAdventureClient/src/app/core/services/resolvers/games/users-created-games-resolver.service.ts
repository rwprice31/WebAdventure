import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';

import { IGame } from '../../../../shared/interfaces/models/game.interface';
import { GameService } from '../../game.service';
import { UserService } from '../../user.service';
import { IUser } from '../../../../shared/interfaces/models/user.interface';
import { IUsersGamesViewModel } from '../../../../shared/interfaces/view-models/games/users-games-view-model.interface';
import { TOASTR_TOKEN } from '../../external-libraries/toastr.service';
import { IToastr } from '../../../../shared/interfaces/external-libraries/toastr.interface';
import { IUsersGameResponse } from '../../../../shared/interfaces/responses/games/users-games-response.interface';

@Injectable()
export class UsersCreatedGamesResolver implements Resolve<Observable<IUsersGameResponse>> {

  constructor(private userService: UserService,
    private gameService: GameService, 
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

    }
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUsersGameResponse> {
      let usersGames: IGame[];
      let currentUser: IUsersGamesViewModel = {
        userId: this.userService.getCurrentUser().id
      };
      if (!currentUser.userId) {
        this.toastr.error('You must log in to view this content.');
        this.router.navigate(['login']);
      }

      return this.gameService.getUsersGames(currentUser).map(
        (res: IUsersGameResponse) => {
          console.log('Games response in resolve = ' + res);
          return res;
        }
      );
  }

}
