import { IGameResponse } from './../../../shared/interfaces/responses/games/game-response.interface';
import { IGameViewModel } from './../../../shared/interfaces/view-models/games/game-view-model.interface';
import { UserService } from './../user.service';
import { Injectable, Inject, OnInit } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IToastr } from './../../../shared/interfaces/external-libraries/toastr.interface';

import { TOASTR_TOKEN } from './../external-libraries/toastr.service';
import { GameService } from '../game.service';
import { IGame } from '../../../shared/interfaces/models/game.interface';
import { IUsersGamesViewModel } from '../../../shared/interfaces/view-models/games/users-games-view-model.interface';
import { IUsersGameResponse } from '../../../shared/interfaces/responses/games/users-games-response.interface';
import { MyGamesHomeComponent } from '../../../my-games/home/my-games-home.component';

/**
 * @class EditGuard
 * @description A guard that let's routes only be activated if the user owns the game they
 * are attempting to edit.
 */
@Injectable()
export class EditGuard implements CanActivate {
    
    private gameId: number;
    private usersGameIds = [];

    constructor(private userService: UserService,
        private gameService: GameService,
        private router: Router,
        @Inject(TOASTR_TOKEN) private toastr: IToastr) {
    }

    fetchIdFromRoute(route: ActivatedRouteSnapshot) {
        this.gameId = +route.params['id'];
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.fetchIdFromRoute(route);
        this.usersGameIds = this.gameService.getCurrentUsersOwnedGameIdsFromSessionStorage();
        if (this.usersGameIds.includes(this.gameId)) {
            this.gameService.storeGameIdUsersCurrentlyEdittingInSessionStorage(this.gameId);
            let game: IGameViewModel = {
                gameId: this.gameId
            };
            this.gameService.getGame(game).subscribe( 
                (res: IGameResponse) => {
                   if (res.status) {
                    //    console.log(res);
                       this.gameService.storeGameUsersCurrentlyEdittingInSessionStorage(res.game);
                   } else {
                       this.toastr.error(res.statusText);
                   }
            });
            return true;
        } else {
            this.toastr.warning('You cannot edit a game you do not own.');
            this.router.navigate(['my-games']);
            return false;
        }
    }

}
