import { Injectable, Inject } from '@angular/core';
import { Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IPlayerOptionsResponse } from '../../../../shared/interfaces/responses/player-options/players-options-response.interface';
import { PlayerOptionsService } from '../../player-options.service';
import { GameService } from '../../game.service';
import { IToastr } from '../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from '../../external-libraries/toastr.service';
import { IPlayerOptionsViewModel } from '../../../../shared/interfaces/view-models/player-options/player-options-view-model.interface';

@Injectable()
export class PlayerOptionsResolver implements Resolve<Observable<IPlayerOptionsResponse>> {
    
    private gameId: number;

    constructor(private playerOptionsService: PlayerOptionsService,
        private gameService: GameService,
        private router: Router,
        @Inject(TOASTR_TOKEN) private toastr: IToastr) {
            this.gameId = this.gameService.getGameIdUsersCurrentlyEdittingFromSessionStorage();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPlayerOptionsResponse> {
        if (!this.gameId) {
            this.toastr.error('A client side error has occured, your game details cannot be fetched at this time.');
            this.router.navigate(['my-games']);
        } else {
            return this.playerOptionsService.getPlayerOptions().map(
                (res: IPlayerOptionsResponse) => {
                    // console.log('IPlayerOptionsResponse in resolve = ' + JSON.stringify(res));
                    return res;
                }
            );
        }
    }

}
