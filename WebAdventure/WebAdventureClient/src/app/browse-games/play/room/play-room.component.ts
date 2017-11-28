import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IToastr } from './../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../../core/services/external-libraries/toastr.service';
import { IUsersGamesViewModel } from './../../../shared/interfaces/view-models/games/users-games-view-model.interface';
import { UserService } from './../../../core/services/user.service';
import { IUserRegistrationViewModel } from './../../../shared/interfaces/view-models/user-registration-view-model.interface';
import { IGamesResponse } from './../../../shared/interfaces/responses/games/games-response.interface';
import { IGame } from './../../../shared/interfaces/models/game.interface';
import { IPlayerGame} from './../../../shared/interfaces/models/player-game.interface';
import { GamePlayService } from './../../../core/services/gameplay.service';
import { UsersCreatedGamesResolver } from '../../../core/services/resolvers/games/users-created-games-resolver.service';
import { IRoomInfo } from './../../../shared/interfaces/models/room-info.interface';
import { PlayGameComponent } from './../play.component';


@Component({
  templateUrl: './play-room.component.html',
  styleUrls: ['./play-room.component.scss']
})
export class PlayRoomComponent {
  
  private playerGame: IPlayerGame;
  private roomInfo: IRoomInfo;
  private gamePlayId: number;
  private roomId: number;
  private gameId: number;
  private sub: any;

  constructor(private gamePlayService: GamePlayService,
    private router: Router,
    private route: ActivatedRoute,
    private playGameComponent: PlayGameComponent,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
  }

  ngOnInit(): void {
      this.sub = this.route.params.subscribe(params => {
          this.roomId = params.roomId as number;
      })
      this.gamePlayId = this.route.params['_value'].playerGameId as number;
      this.gameId = this.playGameComponent.gameId as number;
    console.log(this.roomId);
    console.log(this.gamePlayId);
      this.getCurrentRoomInfo();
  }

  getCurrentRoomInfo() {
      console.log('roomId ' + this.roomId);
      this.gamePlayService.getCurrentRoomInfo(this.gameId, this.gamePlayId, this.roomId).subscribe( (res) => {
        if (res.status) {
            this.roomInfo = res.responseObject as IRoomInfo;
        } else {
            this.toastr.error(res.statusText);
        }
    })
  }

  goToNextRoom(){
     this.router.navigate(['../../', this.gamePlayId, '21'], { relativeTo: this.route });
     this.ngOnDestroy();
     this.ngOnInit();
  }

  ngOnDestroy(){
      this.sub.unsubscribe();
  }
}