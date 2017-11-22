import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IToastr } from './../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../core/services/external-libraries/toastr.service';
import { IUsersGamesViewModel } from './../../shared/interfaces/view-models/games/users-games-view-model.interface';
import { UserService } from './../../core/services/user.service';
import { IUserRegistrationViewModel } from './../../shared/interfaces/view-models/user-registration-view-model.interface';
import { IUsersGameResponse } from './../../shared/interfaces/responses/games/users-games-response.interface';
import { IGame } from './../../shared/interfaces/models/game.interface';
import { GameService } from './../../core/services/game.service';
import { UsersCreatedGamesResolver } from '../../core/services/resolvers/games/users-created-games-resolver.service';

@Component({
  templateUrl: './my-games-home.component.html',
  styleUrls: ['./my-games-home.component.scss']
})
export class MyGamesHomeComponent implements OnInit {

  private usersCreatedGames: IGame[];
  private savedGames: IGame[];

  constructor(private gameService: GameService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {

  }

  ngOnInit(): void {
    this.getUsersCreatedGames();
  }

  getUsersCreatedGames() {
    this.route.data.subscribe( (data: { gamesResponse: IUsersGameResponse }) => {
      if (data.gamesResponse.status) {
        this.usersCreatedGames = data.gamesResponse.games;  
      } else {
        this.toastr.error(data.gamesResponse.statusText);
      }
    });
  }

  public getUsersGames(): IGame[] {
    return this.usersCreatedGames;
  }

  private retrieveUsersSavedGames() {

  }

  private playClicked($event) {
    // console.log('Save event received in game home' + JSON.stringify($event));
  }

  private editClicked($event) {
    // console.log('Edit event received in game home' + JSON.stringify($event));
    this.router.navigate(['edit', $event.id], { relativeTo: this.route });
  }

}
