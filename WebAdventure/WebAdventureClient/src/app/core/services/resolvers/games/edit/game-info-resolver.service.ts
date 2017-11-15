import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { IGameResponse } from '../../../../../shared/interfaces/responses/games/game-response.interface';
import { UserService } from '../../../user.service';
import { GameService } from '../../../game.service';
import { TOASTR_TOKEN } from '../../../external-libraries/toastr.service';
import { IToastr } from '../../../../../shared/interfaces/external-libraries/toastr.interface';
import { IGameViewModel } from '../../../../../shared/interfaces/view-models/games/game-view-model.interface';
import { EditComponent } from '../../../../../my-games/edit/edit.component';

/**
 * @class GameInfoResolver
 * @description Resolver that provides a IGameResponse observable to component's that are set
 * to resolve to this class.
 */
@Injectable()
export class GameInfoResolver implements Resolve<Observable<IGameResponse>> {

  private gameId: number;

  constructor(private userService: UserService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
      this.gameId = gameService.getGameIdUsersCurrentlyEdittingFromSessionStorage();
      // console.log('Game id in info resolver = ' + this.gameId);
    }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGameResponse> {
    if (!this.gameId) {
      this.toastr.error('A client side error has occured, your game details cannot be fetched at this time.');
      this.router.navigate(['my-games']);
    } else {
      let currentGame: IGameViewModel = {
        gameId: this.gameId
      };
      return this.gameService.getGame(currentGame).map(
        (res: IGameResponse) => {
          // console.log('IGameResponse in resolve = ' + JSON.stringify(res.game));
          return res;
        }
      );
    }
  }
}
