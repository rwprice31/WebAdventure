import { Component, OnInit, Inject } from '@angular/core';
import { IRoom } from '../../../../../shared/interfaces/models/room.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IExit } from '../../../../../shared/interfaces/models/exit.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomService } from '../../../../../core/services/room.service';
import { IRoomExitCreationViewModel } from '../../../../../shared/interfaces/view-models/rooms/room-exit-creation-view-model.interface';
import { IRoomsResponse } from '../../../../../shared/interfaces/responses/rooms/rooms-response.interface';
import { IToastr } from '../../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from '../../../../../core/services/external-libraries/toastr.service';
import { IRoomExitCreationResponse } from '../../../../../shared/interfaces/responses/rooms/room-exit-creation-response.interface';


@Component({
  templateUrl: './room-exit.component.html',
  styleUrls: ['./room-exit.component.scss']
})
export class RoomExitComponent implements OnInit {

    
    private rooms: IRoom[];
    private roomExitForm: FormGroup;
    private roomExit: IExit;
    private roomId: number;
    private isUpdating = false;

    constructor(private formBuilder: FormBuilder,
      private router: Router,
      private roomSerivce: RoomService,
      @Inject(TOASTR_TOKEN) private toastr: IToastr,
      private route: ActivatedRoute) {
        this.buildForm();
    }

    ngOnInit() {
      this.roomId = this.roomSerivce.getCurrentEdittingRoomFromSessionStorage();
      this.retrieveRooms();
    }

    private submit() {
      this.createRoomExit();
    }

    private retrieveRooms(): void {
      this.route.data.subscribe( (data: { roomsResponse: IRoomsResponse }) => {
        // console.log('Response in room-exit = ' + JSON.stringify(data));
        if (data.roomsResponse.status) {
          this.rooms = data.roomsResponse.rooms;
        } else {
          this.toastr.error(data.roomsResponse.statusText);
        }
      });
    }

    private buildForm(): void {
      this.roomExitForm = this.formBuilder.group({
        room: ['', Validators.required],
        descr: [''],
        command: ['', Validators.required]
      });
    }

    private createRoomExit() {
      let exit: IRoomExitCreationViewModel = {
        commands: this.roomExitForm.controls['command'].value,
        nextRoomId: this.roomExitForm.controls['room'].value,
        descr: this.roomExitForm.controls['descr'].value
      };
      this.roomSerivce.createExitForRoom(exit).subscribe(
        (res: IRoomExitCreationResponse) => {
          console.log(JSON.stringify(res));
          // if (res.status) {
          //   this.roomExit = res.exits[0];
          // }
          
        }
      );
    }

    private updateRoomExit() {

    }

}
