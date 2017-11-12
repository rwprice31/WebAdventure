import { Component } from '@angular/core';

@Component({
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss']
})
export class RoomComponent {
  editClicked($event: any) {
    console.log('Event received in room component! ' + $event.rowID);
  }
}
