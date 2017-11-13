import { IRoomCreationResponse } from './../../../../shared/interfaces/responses/rooms/room-creation-response.interface';
import { IGame } from './../../../../shared/interfaces/models/game.interface';
import { GameService } from './../../../../core/services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../../../core/services/external-libraries/toastr.service';
import { DialogService } from './../../../../core/services/dialog.service';
import { RoomService } from './../../../../core/services/room.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IRoom } from './../../../../shared/interfaces/models/room.interface';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

    room: IRoom;
    roomInfoForm: FormGroup;
    confirmNavigation: boolean;
    roomId: number;
    game: IGame;
  
    constructor(private formBuilder: FormBuilder,
      private roomService: RoomService,
      private gameService: GameService,
      private dialogService: DialogService,
      @Inject(TOASTR_TOKEN) private toastr: IToastr,
      private router: Router,
      private route: ActivatedRoute) {
          this.buildForm();
    }
  
    ngOnInit() {
        this.room = null;
        this.game = this.gameService.getGameUsersCurrentlyEdittingFromSessionStorage();
    }
  
    buildForm() {
      this.roomInfoForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['']
      });
    }

    submit() {
      if (!this.room) {
        this.createRoom();
      } else {
        // update room
      }
    }

    createRoom() {
      let room: IRoom = {
        id: 0,
        name: this.roomInfoForm.controls['name'].value,
        descr: this.roomInfoForm.controls['description'].value,
        actions: null,
        game:  this.game
      };
      this.roomService.createRoom(room).subscribe( 
        (res: IRoomCreationResponse) => {
          if (res.status) {
            // console.log('Success! res = ' + res);
            this.toastr.success('Room successfully created!');
            this.router.navigate(['../'], { relativeTo: this.route});
          } else {
            this.toastr.error(res.statusText);
          }
      });
    }

    updateRoom() {

    }

}
