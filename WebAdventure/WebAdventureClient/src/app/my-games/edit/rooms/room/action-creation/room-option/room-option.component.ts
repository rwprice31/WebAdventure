import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IItemsResponse } from '../../../../../../shared/interfaces/responses/items/items-response.interface';
import { IItem } from '../../../../../../shared/interfaces/models/item.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IRoom } from '../../../../../../shared/interfaces/models/room.interface';
import { IRoomsResponse } from '../../../../../../shared/interfaces/responses/rooms/rooms-response.interface';
import { IToastr } from '../../../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from '../../../../../../core/services/external-libraries/toastr.service';
import { RoomActionOutcomeService } from '../../../../../../core/services/room-action-outcome.service';
import { IActionOutcome } from '../../../../../../shared/interfaces/models/action-outcome.interface';
import { IOutcome } from '../../../../../../shared/interfaces/models/outcome.interface';

@Component({
  templateUrl: './room-option.component.html',
  styleUrls: ['./room-option.component.scss']
})
export class RoomOptionComponent implements OnInit {
  
  private rooms: IRoom[];
  private roomSelectionForm: FormGroup;
  private selectedRoom: IRoom;

  private outcome: IOutcome;

  constructor(private route: ActivatedRoute,
  private formBuilder: FormBuilder,
  private roomActionOutcome: RoomActionOutcomeService,
  @Inject(TOASTR_TOKEN) private toastr: IToastr) {
    
  }

  ngOnInit(): void {
    this.retrieveItems();
    this.buildForm();
    this.outcome = this.roomActionOutcome.getCurrentOutcomeSessionStorage();
    console.log('In room option outcome = ' + JSON.stringify(this.outcome));
  }

  private buildForm() {
    this.roomSelectionForm = this.formBuilder.group({
      room: ['', Validators.required]
    });
  }

  retrieveItems(): void {
    this.route.data.subscribe( (data: { roomsResponse: IRoomsResponse }) => {
      if (data.roomsResponse.status) {
        this.rooms = data.roomsResponse.rooms;
        console.log('This rooms = ' + this.rooms);
      } else {
        this.toastr.error(data.roomsResponse.statusText);
      }
    });
  }

  private roomSelected(roomId: number) {
    this.selectedRoom = this.rooms.find(r => r.id === +roomId);
    // console.log('Current room id = ' + this.roomSelectionForm.controls['room'].value);
    this.outcome.room = this.selectedRoom;
    // console.log('Setting outcome = ' + JSON.stringify(this.outcome));
    this.roomActionOutcome.setCurrentOutcomeSessionStorage(this.outcome);
  }

  private setFormValues() {

  }
    
}
