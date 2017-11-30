import { IRoomCreationResponse } from './../../../../shared/interfaces/responses/rooms/room-creation-response.interface';
import { IGame } from './../../../../shared/interfaces/models/game.interface';
import { GameService } from './../../../../core/services/game.service';
import { ActivatedRoute, Router, Params, Event, NavigationEnd } from '@angular/router';
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
import { Subject } from 'rxjs/Subject';
import { IRoomExitsResponse } from '../../../../shared/interfaces/responses/rooms/room-exits-response.interface';
import { IExit } from '../../../../shared/interfaces/models/exit.interface';
import { IMonster } from '../../../../shared/interfaces/models/monster.interface';
import { IItem } from '../../../../shared/interfaces/models/item.interface';
import { SimpleTableColumn, SimpleTableRow } from '../../../../shared/components/simple-table/simple-table.component';
import { IRoomExitDeletionViewModel } from '../../../../shared/interfaces/view-models/rooms/room-exit-deletion-view-model.interface';
import { IRoomExitDeletionResponse } from '../../../../shared/interfaces/responses/rooms/room-exit-deletion-response.interface';
import { IRoomItemsResponse } from '../../../../shared/interfaces/responses/rooms/room-items-response.interface';
import { IRoomItemDeletionViewModel } from '../../../../shared/interfaces/view-models/rooms/room-item-deletion-view-model.interface';
import { IRoomItemDeletionResponse } from '../../../../shared/interfaces/responses/rooms/room-item-deletion-response.interface';

@Component({
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, CanComponentDeactivate {

    public static exitCreation: Subject<any> = new Subject();
    public static monsterCreation: Subject<any> = new Subject();
    public static itemCreation: Subject<any> = new Subject();

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

    private exits: IExit[];
    private monsters: IMonster[];
    private items: IItem[];

    private exitColumns: SimpleTableColumn[] = [];
    private exitRows: SimpleTableRow[] = [];

    private itemColumns: SimpleTableColumn[] = [];
    private itemRows: SimpleTableRow[] = [];

    private monsterColumns: SimpleTableColumn[] = [];
    private monsterRows: SimpleTableRow[] = [];

    constructor(private formBuilder: FormBuilder,
      private roomService: RoomService,
      private gameService: GameService,
      private dialogService: DialogService,
      @Inject(TOASTR_TOKEN) private toastr: IToastr,
      private router: Router,
      private route: ActivatedRoute) {
          this.buildForm();

          // listen to updates from child components

          RoomComponent.exitCreation.subscribe( (res) => {
            this.createExitButtonVisible = true;
            this.retrieveRoomExitsFromService();
          });

          RoomComponent.itemCreation.subscribe( (res) => {
            this.createItemButtonVisible = true;
            this.retrieveRoomItemsFromService();
          });

          RoomComponent.monsterCreation.subscribe( (res) => {
            this.createMonsterButtonVisible = true;
            this.retrieveRoomMonsters();
          });

    }
  
    ngOnInit() {
      this.roomId = this.roomService.getCurrentlyEdittingRoomFromSessionStorage();
      if (this.roomId === 0) {
        // this.room = null;
        this.isUpdating = false;
      } else {
        this.isUpdating = true;
        this.retrieveRoom();
      }
      this.gameId = this.gameService.getGameIdUsersCurrentlyEdittingFromSessionStorage();
      this.retrieveRoomExitsFromRoute();
      this.retrieveRoomItemsFromRoute();
      this.retrieveRoomMonsters();

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
      if (this.isUpdating) {
        this.updateRoom();
      } else {
        this.createRoom();
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
            this.router.navigate(['../../', this.room.id], { relativeTo: this.route});
            this.isUpdating = true;
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

    private retrieveRoomExitsFromRoute() {
      this.route.data.subscribe( (data: { roomExitsResponse: IRoomExitsResponse }) => {
        if (data.roomExitsResponse.status) {
          this.exits = data.roomExitsResponse.exits;
          this.buildExitTable();
        } else {
          this.toastr.error(data.roomExitsResponse.statusText);
        }
      });      
    }

    private retrieveRoomExitsFromService() {
      this.roomService.getExitsForRoom().subscribe( (res: IRoomExitsResponse) => {
        if (res.status) {
          this.exits = res.exits;
          this.buildExitTable();
        } else {
          this.toastr.error(res.statusText);
        }
      });
    }

    private retrieveRoomItemsFromService() {
      this.roomService.getItemsForRoom().subscribe( (res: IRoomItemsResponse) => {
        if (res.status) {
          this.items = res.items;
          this.buildItemTable();
        } else {
          this.toastr.error(res.statusText);
        }
      });
    }

    private retrieveRoomItemsFromRoute() {
      this.route.data.subscribe( (data: { roomItemsResponse: IRoomItemsResponse }) => {
        if (data.roomItemsResponse.status) {
          this.items = data.roomItemsResponse.items;
          this.buildItemTable();
        } else {
          this.toastr.error(data.roomItemsResponse.statusText);
        }
      });  
    }

    private retrieveRoomMonsters() {

    }

    private buildExitTable() {

      this.exitRows = [

      ];

      this.exitColumns = [
        {
          name: 'Command'
        },
        {
          name: 'Room'
        }
      ];

      this.exits.forEach(exit => {
        this.exitRows.push({
          rowID: exit.id,
          rowData: [
            {
              columnName: 'Command',
              data: exit.commands
            },
            {
              columnName: 'Room',
              data: exit.nextRoom.name
            }
          ]
        });
      });

    }

    private buildMonsterTable() {

    }

    private buildItemTable() {
      this.itemRows = [

      ];

      this.itemColumns = [
        {
          name: 'Item'
        }
      ];

      this.items.forEach(item => {
        this.itemRows.push({
          rowID: item.id,
          rowData: [
            {
              columnName: 'Item',
              data: item.name
            }
          ]
        });
      });

    }

    private deleteExit($event: SimpleTableRow) {
      this.dialogService.confirm('Do you really want to delete this exit?').subscribe( 
        (res: boolean) => {
            if (res) {
                let exit: IRoomExitDeletionViewModel = {
                    exitId: $event.rowID
                };
                this.roomService.deleteRoomExit(exit).subscribe( 
                    (d_res: IRoomExitDeletionResponse) => {
                        if (d_res) {
                            this.toastr.success(d_res.statusText);
                            this.exits = d_res.exits;
                            this.buildExitTable();
                        } else {
                            this.toastr.error(d_res.statusText);
                        }   
                    }
                );
            } else {

            }
    });
    }

    private deleteItem($event: SimpleTableRow) {
      this.dialogService.confirm('Do you really want to delete this item?').subscribe( 
        (res: boolean) => {
            if (res) {
                let item: IRoomItemDeletionViewModel = {
                    itemId: $event.rowID
                };
                this.roomService.deleteRoomItem(item).subscribe( 
                    (d_res: IRoomItemDeletionResponse) => {
                        if (d_res.status) {
                            this.toastr.success(d_res.statusText);
                            this.items = d_res.items;
                            this.buildItemTable();
                        } else {
                            this.toastr.error(d_res.statusText);
                        }   
                    }
                );
            } else {

            }
    });
    }

    private editExit($event: SimpleTableRow) {
      this.createExitButtonVisible = false;
      this.router.navigate([{ outlets: {'exit': [$event.rowID]} }], { relativeTo: this.route });
    }

}
