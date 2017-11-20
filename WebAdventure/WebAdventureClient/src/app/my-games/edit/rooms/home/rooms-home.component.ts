import { PageNotFoundComponent } from './../../../../page-not-found.component';
import { TOASTR_TOKEN } from './../../../../core/services/external-libraries/toastr.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { IRoomsResponse } from './../../../../shared/interfaces/responses/rooms/rooms-response.interface';
import { RoomService } from './../../../../core/services/room.service';
import { IRoom } from './../../../../shared/interfaces/models/room.interface';
import { SimpleTableRow, SimpleTableColumn, SimpleTableRowCell } from './../../../../shared/components/simple-table/simple-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { DialogService } from '../../../../core/services/dialog.service';
import { IRoomDeletionViewModel } from '../../../../shared/interfaces/view-models/rooms/room-deletion-view-model.interface';
import { IRoomDeletionResponse } from '../../../../shared/interfaces/responses/rooms/room-deletion-response.interface';

@Component({
  templateUrl: './rooms-home.component.html',
  styleUrls: ['./rooms-home.component.scss']
})
export class RoomsHomeComponent implements OnInit {

    private rooms: IRoom[];

    private columns: SimpleTableColumn[] = [];
    private rows: SimpleTableRow[] = [];

    constructor(private router: Router,
        private route: ActivatedRoute,
        @Inject(TOASTR_TOKEN) private toastr: IToastr,
        private roomService: RoomService,
        private dialogService: DialogService) {
    }

    ngOnInit(): void {
        this.retrieveRooms();
        this.buildTableData();
    }

    retrieveRooms(): void {
        this.route.data.subscribe( (data: { roomsResponse: IRoomsResponse }) => {
            if (data.roomsResponse.status) {
                this.rooms = data.roomsResponse.rooms;
            } else {
                this.toastr.error(data.roomsResponse.statusText);
            }
        });
    }

    buildTableData() {

        this.rows = [

        ];

        this.columns = [
          {
              name: 'Name'
          },
          {
              name: 'Description'
          },  
        ];

        this.rooms.forEach(room => {
            this.rows.push({
                rowID: room.id,
                rowData: [
                    {
                        columnName: 'Name',
                        data: room.name
                    },
                    {
                        columnName: 'Description',
                        data: room.descr
                    }
                ]
            });
        });
    }

    editClicked($event: SimpleTableRow) {
        this.router.navigate([$event.rowID], { relativeTo: this.route});
    }

    deleteClicked($event: SimpleTableRow) {
        this.dialogService.confirm('Do you really want to delete this room?').subscribe( 
            (res: boolean) => {
                if (res) {
                    let room: IRoomDeletionViewModel = {
                        id: $event.rowID
                    };
                    this.roomService.deleteRoom(room).subscribe( 
                        (d_res: IRoomDeletionResponse) => {
                            if (d_res) {
                                this.toastr.success(d_res.statusText);
                                this.rooms = d_res.rooms;
                                this.buildTableData();
                            } else {
                                this.toastr.error(d_res.statusText);
                            }   
                        }
                    );
                } else {

                }
        });
    }

}

