import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IToastr } from './../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../core/services/external-libraries/toastr.service';
import { IUsersGamesViewModel } from './../../shared/interfaces/view-models/games/users-games-view-model.interface';
import { UserService } from './../../core/services/user.service';
import { IUserRegistrationViewModel } from './../../shared/interfaces/view-models/user-registration-view-model.interface';
import { IGamesResponse } from './../../shared/interfaces/responses/games/games-response.interface';
import { IGame } from './../../shared/interfaces/models/game.interface';
import { IPlayerGame} from './../../shared/interfaces/models/player-game.interface';
import { GamePlayService } from './../../core/services/gameplay.service';
import { UsersCreatedGamesResolver } from '../../core/services/resolvers/games/users-created-games-resolver.service';



@Component({
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayGameComponent {
  
  private game: IGame;
  public gameId: number;
  private playerGame: IPlayerGame;
  private clicked: boolean;

  constructor(private gamePlayService: GamePlayService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
      this.gameId = this.route.params['_value'].id as number;
  }

  ngOnInit(): void {
    this.clicked = true;
    this.getGame();
  }

  getGame() {
    this.gamePlayService.getGame(this.gameId).subscribe( (res) => {
      if (res.status) {
        this.game = res.responseObject as IGame;
      } else {
        this.toastr.error(res.statusText);
      }
    })
  }

  startGame() {
    this.gamePlayService.startGame(this.gameId).subscribe( (res) => {
      if (res.status) {
        this.clicked = false;
        this.playerGame = res.responseObject as IPlayerGame;

        this.router.navigate([this.playerGame.id, this.playerGame.roomId], { relativeTo: this.route });
      } else {
        this.toastr.error(res.statusText);
      }
    })
  }
}
