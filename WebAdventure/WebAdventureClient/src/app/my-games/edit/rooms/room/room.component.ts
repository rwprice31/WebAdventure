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
import { IRoomViewModel } from '../../../../shared/interfaces/view-models/rooms/room-view-model.interface';
import { IRoomResponse } from '../../../../shared/interfaces/responses/rooms/room-response.interface';
import * as _ from 'lodash';
import { CanComponentDeactivate } from '../../../../core/services/guards/can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';
import { compareFormGroupValues } from '../../../../shared/functions/copy-form-group';
import { IRoomUpdationViewModel } from '../../../../shared/interfaces/view-models/rooms/room-updation-view-model.interface';
import { IRoomUpdationResponse } from '../../../../shared/interfaces/responses/rooms/room-updation-response.interface';

@Component({
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, CanComponentDeactivate {

    private room: IRoom;
    private roomInfoForm: FormGroup;
    private originalRoomInfoForm: FormGroup;
    private confirmNavigation: boolean;
    private roomId: number;
    private gameId: number;
    private isUpdating: boolean;

    private createMonsterButtonVisible = true;
    private createItemButtonVisible = true;
    private createExitButtonVisible = true;

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
      this.roomId = this.roomService.getCurrentEdittingRoomFromSessionStorage();
      if (this.roomId === 0) {
        // this.room = null;
        this.isUpdating = false;
      } else {
        this.isUpdating = true;
        this.retrieveRoom();
      }
      this.gameId = this.gameService.getGameIdUsersCurrentlyEdittingFromSessionStorage();
    }

    private retrieveRoom(): void {
      this.route.data.subscribe( (data: { roomResponse: IRoomResponse }) => {
        if (data.roomResponse.status) {
            this.room = data.roomResponse.room;
            this.setFormValues();
            // console.log('This room = ' + JSON.stringify(this.room));
        } else {
            this.toastr.error(data.roomResponse.statusText);
        }
      });
    }
  
    private buildForm(): void {
      this.roomInfoForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['']
      });
    }

    private setFormValues(): void {
      this.roomInfoForm.setValue({
        name: this.room.name,
        description: this.room.descr
      });
      this.originalRoomInfoForm = _.cloneDeep(this.roomInfoForm);
    }

    private submit() {
      if (!this.room) {
        this.createRoom();
      } else {
        this.updateRoom();
      }
    }

    private createRoom() {
      let room: IRoom = {
        id: 0,
        name: this.roomInfoForm.controls['name'].value,
        descr: this.roomInfoForm.controls['description'].value,
        actions: null,
        gameId:  this.gameId
      };
      this.roomService.createRoom(room).subscribe( 
        (res: IRoomCreationResponse) => {
          if (res.status) {
            // console.log('Success! res = ' + res);
            this.room = res.room;
            this.setFormValues();
            this.toastr.success(res.statusText);
            this.router.navigate(['../'], { relativeTo: this.route});
          } else {
            this.toastr.error(res.statusText);
          }
      });
    }

    private updateRoom() {
      let room: IRoomUpdationViewModel = {
        id: this.roomId,
        name: this.roomInfoForm.controls['name'].value,
        descr: this.roomInfoForm.controls['description'].value
      };
      this.roomService.updateRoom(room).subscribe(
        (res: IRoomUpdationResponse) => {
          if (res.status) {
            this.room = res.room;
            this.setFormValues();
            this.toastr.success(res.statusText);
            this.router.navigate(['../'], { relativeTo: this.route });
          } else {
            this.toastr.error(res.statusText);
          }
        }
      );
    }

    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
      // only prompt for message if values have changed
      if (!compareFormGroupValues(this.originalRoomInfoForm, this.roomInfoForm)) {
        return this.dialogService.confirm('Leave and lose unsaved changes?');
      } else {
        return true;
      }
    }

    createNewExit() {
      this.createExitButtonVisible = false;
      this.router.navigate([{ outlets: {'exit': ['0']} }], { relativeTo: this.route });
    }

    createNewItem() {
      this.createItemButtonVisible = false;
      this.router.navigate([{ outlets: {'item': ['0']} }], { relativeTo: this.route });
    }

}
