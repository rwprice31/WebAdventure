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
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IBackPack } from './../../../shared/interfaces/models/backpack.interface';
import { SimpleTableRow, SimpleTableColumn, SimpleTableRowCell } from './../../../shared/components/simple-table/simple-table.component';

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
  private userInput: string = "";
  private items: string = "";
  inputForm: FormGroup;
  private nextRoomId: number = -1;
  private backpack: IBackPack;
  private columns: SimpleTableColumn[] = [];
  private rows: SimpleTableRow[] = [];

  constructor(private gamePlayService: GamePlayService,
    private router: Router,
    private route: ActivatedRoute,
    private playGameComponent: PlayGameComponent,
    private formBuilder: FormBuilder,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
  }

  ngOnInit(): void {
      this.setBackPack();
      this.playGameComponent.clicked = false;
      this.sub = this.route.params.subscribe(params => {
          if (this.roomId != params.roomId as number)
            {
                this.roomId = params.roomId as number;
                this.getCurrentRoomInfo();
            }
      })
      this.gamePlayId = this.route.params['_value'].playerGameId as number;
      this.gameId = this.playGameComponent.gameId as number;
      this.buildForm();
      this.buildTableData();
  }

  buildForm() {
    this.inputForm = this.formBuilder.group({
      userInput: ['', Validators.required]
    });
  }

  getCurrentRoomInfo() {
      this.gamePlayService.getCurrentRoomInfo(this.gameId, this.gamePlayId, this.roomId).subscribe( (res) => {
        if (res.status) {
            this.roomInfo = res.responseObject as IRoomInfo;
            console.log(this.roomInfo);
        } else {
            this.toastr.error(res.statusText);
        }
    })
  }

  getUsersInput() {
    let temp = this.inputForm.controls['userInput'].value as string;
    this.userInput = temp.toLowerCase();
    for (var i = 0; i < this.roomInfo.exits.length; i++) {
            if (this.roomInfo.exits[i].commands.toLowerCase().search(this.userInput) == -1) {
            console.log("does not contain");
            } else {
                this.nextRoomId = this.roomInfo.exits[i].nextRoomId;
                this.goToNextRoom();
                break;
            }
    }
  }

  goToNextRoom() {
      if (this.nextRoomId != -1) {
          console.log(this.nextRoomId);
          this.router.navigate(['../../', this.gamePlayId, this.nextRoomId], { relativeTo: this.route });
    this.gamePlayService.updatePlayerRoom(this.gameId, this.gamePlayId, this.nextRoomId).subscribe( (res) =>{
          if (res.status) {
              console.log("succeeded");
          } else {
              console.log("failed");
          }
      });  
    }
      
     this.ngOnInit();
  }

  setBackPack() {
    if (this.gamePlayId != null) {
      this.gamePlayService.getBackPack(this.gameId, this.gamePlayId).subscribe( (res) => {
      if (res.status) {
        this.backpack = res.responseObject as IBackPack;
        console.log(this.backpack);
      } else {
        console.log("No Items in back pack");
      }
      });
    }
  }

  buildTableData() {
        this.rows = [

        ];

        this.columns = [
          {
              name: 'Name'
          },
          {
            name: 'Type'
          },
          {
              name: 'Description'
          },
          {
            name:'Points'
          },
          {
            name:'Equipped'
          }
        ];

console.log("here");
        console.log(this.backpack);
        console.log(this.backpack.items.length);
        this.backpack.items.forEach(items => {
            console.log(items.item.name);
            console.log(items.item.type.type);
            console.log(items.item.descr);
            console.log(items.item.points);
            console.log(items.isEquipped);
        })

        this.backpack.items.forEach(items => {
            this.rows.push({
                rowID: items.item.id,
                rowData: [
                    {
                        columnName: 'Name',
                        data: items.item.name as string
                    },
                    {
                        columnName: 'Type',
                        data: items.item.type.type as string
                    },
                    {
                        columnName: 'Description',
                        data: items.item.descr as string
                    },
                    {
                      columnName:'Points',
                      data:items.item.points.toString()
                    },
                    {
                      columnName:'Equipped',
                      data:items.isEquipped.toString()
                    }
                ]
            });
        });
    }
}