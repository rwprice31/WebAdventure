import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IToastr } from './../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../core/services/external-libraries/toastr.service';
import { IUsersGamesViewModel } from './../shared/interfaces/view-models/games/users-games-view-model.interface';
import { UserService } from './../core/services/user.service';
import { IUserRegistrationViewModel } from './../shared/interfaces/view-models/user-registration-view-model.interface';
import { IGamesResponse } from './../shared/interfaces/responses/games/games-response.interface';
import { IGame } from './../shared/interfaces/models/game.interface';
import { GameService } from './../core/services/game.service';
import { UsersCreatedGamesResolver } from '../core/services/resolvers/games/users-created-games-resolver.service';

@Component({
  templateUrl: './browse-games.component.html',
  styleUrls: ['./browse-games.component.scss']
})
export class BrowseGamesComponent implements OnInit{
  
  private games: IGame[];

  constructor(private gameService: GameService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
  }

  ngOnInit(): void {
        this.getCreatedGames();
  }

  getCreatedGames() {
    this.gameService.getGames().subscribe( (res) => {
      if (res.status) {
        this.games = res.games;
      } else {
        this.toastr.error(res.statusText);
      }
    });
  }

  public getExistingGames(): IGame[] {
    return this.games;
  }

  private playClicked($event) {
    this.router.navigate(['play', $event.id], { relativeTo: this.route });
  }

}