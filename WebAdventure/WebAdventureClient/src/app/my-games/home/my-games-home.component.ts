import { IToastr } from './../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../core/services/external-libraries/toastr.service';
import { IUsersGamesViewModel } from './../../shared/interfaces/view-models/games/users-games-view-model.interface';
import { UserService } from './../../core/services/user.service';
import { IUserRegistrationViewModel } from './../../shared/interfaces/view-models/user-registration-view-model.interface';
import { IUsersGameResponse } from './../../shared/interfaces/responses/games/users-games-response.interface';
import { IGame } from './../../shared/interfaces/models/game.interface';
import { GameService } from './../../core/services/game.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  templateUrl: './my-games-home.component.html',
  styleUrls: ['./my-games-home.component.scss']
})
export class MyGamesHomeComponent implements OnInit {

  private games: IGame[];
  private savedGames: IGame[];

  constructor(private gameService: GameService,
    private userService: UserService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

  }

  ngOnInit(): void {
    this.getUsersGames();
  }

  getUsersGames() {
    let user: IUsersGamesViewModel = {
      userId: this.userService.getCurrentUser().id
    };
    this.gameService.getUsersGames(user).subscribe(
      (res: IUsersGameResponse) => {
        if (res.status) {
          console.log('IUsersGameReponse received = ', res.games);
          this.games = res.games;
        } else {
          this.toastr.error(res.statusText);
        }
      }
    );
  }

  getUsersSavedGames() {

  }

  playClicked($event) {
    console.log('Save event received in game home' + JSON.stringify($event));
  }

  editClicked($event) {
    console.log('Edit event received in game home' + JSON.stringify($event));
  }

}
