import { Component, OnInit, Inject } from '@angular/core';
import { IRoom } from '../../../../../shared/interfaces/models/room.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IExit } from '../../../../../shared/interfaces/models/exit.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomService } from '../../../../../core/services/room.service';
import { IRoomsResponse } from '../../../../../shared/interfaces/responses/rooms/rooms-response.interface';
import { IToastr } from '../../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from '../../../../../core/services/external-libraries/toastr.service';
import { RoomComponent } from '../room.component';
import { IItem } from '../../../../../shared/interfaces/models/item.interface';
import { IRoomItemCreationViewModel } from '../../../../../shared/interfaces/view-models/rooms/room-item-creeation-view-model.interface';
import { IRoomItemCreationResponse } from '../../../../../shared/interfaces/responses/rooms/room-item-creation-response.interface';
import { IRoomItemsResponse } from '../../../../../shared/interfaces/responses/rooms/room-items-response.interface';
import { IItemsResponse } from '../../../../../shared/interfaces/responses/items/items-response.interface';


@Component({
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss']
})
export class RoomItemComponent implements OnInit {

    private exitId: number;
    private rooms: IRoom[];
    private roomItemForm: FormGroup;
    private roomItem: IItem;
    private roomId: number;
    private items: IItem[];

    constructor(private formBuilder: FormBuilder,
      private router: Router,
      private roomSerivce: RoomService,
      @Inject(TOASTR_TOKEN) private toastr: IToastr,
      private route: ActivatedRoute) {
        this.buildForm();
    }

    ngOnInit() {
      this.roomId = this.roomSerivce.getCurrentlyEdittingRoomFromSessionStorage();      
      if (this.roomId === 0) {
        this.toastr.error('An error as occured, unable to find room');
        this.router.navigate(['']);
      }
      this.retrieveItems();
    }

    private retrieveItems() {
      this.route.data.subscribe( (data: { itemsResponse: IItemsResponse } ) => {
        if (data.itemsResponse.status) {
          this.items = data.itemsResponse.items;
          console.log('This items = ' + this.items);
        } else {
          this.toastr.error(data.itemsResponse.statusText);
        }
      });
    }

    private submit() {
      this.createRoomItem();
    }

    private buildForm(): void {
      this.roomItemForm = this.formBuilder.group({
        item: ['', Validators.required],
      });
    }

    private createRoomItem() {
      let item: IRoomItemCreationViewModel = {
        itemId: this.roomItemForm.controls['item'].value,
      };
      console.log('Room item = ' + item.itemId);
      this.roomSerivce.createItemForRoom(item).subscribe(
        (res: IRoomItemCreationResponse) => {
          console.log(JSON.stringify(res));
          if (res.status) {
            this.toastr.success(res.statusText);
            RoomComponent.itemCreation.next();
            this.router.navigate(['room', { outlets: { item: null } }], { relativeTo: this.route });
          } else {
            this.toastr.error(res.statusText);
          }
        }
      );
    }

}
