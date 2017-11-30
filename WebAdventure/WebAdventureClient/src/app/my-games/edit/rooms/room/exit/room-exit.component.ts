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
import { RoomComponent } from '../room.component';
import { IRoomExitsResponse } from '../../../../../shared/interfaces/responses/rooms/room-exits-response.interface';
import { IRoomExitUpdationViewModel } from '../../../../../shared/interfaces/view-models/rooms/room-exit-updation-view-model.interface';
import { IRoomExitUpdationResponse } from '../../../../../shared/interfaces/responses/rooms/room-exit-updation-response.interface';


@Component({
  templateUrl: './room-exit.component.html',
  styleUrls: ['./room-exit.component.scss']
})
export class RoomExitComponent implements OnInit {

    private exitId: number;
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
      this.roomId = this.roomSerivce.getCurrentlyEdittingRoomFromSessionStorage();
  
      this.retrieveRooms();
      
      if (this.roomId === 0) {
        this.toastr.error('An error as occured, unable to find room');
        this.router.navigate(['']);
      }

      this.exitId = this.roomSerivce.getCurrentlyEdittingRoomExitFromSessionStorage();
      if (this.exitId === 0) {
        this.isUpdating = false;
      } else {
        this.isUpdating = true;
        this.retrieveExit();
      }
    
    }

    private submit() {
      if (this.isUpdating) {
        this.updateRoomExit();
      } else {
        this.createRoomExit();
      }
    }

    private retrieveExit(): void {
      this.route.data.subscribe( (data: { exitResponse: IRoomExitsResponse } ) => {
        if (data.exitResponse.status) {
          this.roomExit = data.exitResponse.exits[0];
          this.setFormValues();
        } else {
          this.toastr.error(data.exitResponse.statusText);
        }
      });
    }

    private setFormValues(): void {
      this.roomExitForm.setValue({
        room: this.roomExit.nextRoom.id,
        descr: this.roomExit.descr,
        command: this.roomExit.commands
      });
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
          if (res.status) {
            // this.roomExit = res.exits[0];
            this.toastr.success(res.statusText);
            RoomComponent.exitCreation.next();
            this.router.navigate(['room', { outlets: { exit: null } }], { relativeTo: this.route });
          } else {
            this.toastr.error(res.statusText);
          }
        }
      );
    }

    private updateRoomExit() {
      let exit: IRoomExitUpdationViewModel = {
        id: this.roomExit.id,
        commands: this.roomExitForm.controls['command'].value,
        descr: this.roomExitForm.controls['descr'].value,
        nextRoomId: this.roomExitForm.controls['room'].value
      };
      this.roomSerivce.updateRoomExit(exit).subscribe(
        (res: IRoomExitUpdationResponse) => {
          if (res.status) {
            this.toastr.success(res.statusText);
            RoomComponent.exitCreation.next();
            this.router.navigate(['room', { outlets: { exit: null } }], { relativeTo: this.route });
          } else {
            this.toastr.error(res.statusText);
          }
        }
      );
    }

}
