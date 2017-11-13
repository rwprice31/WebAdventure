import { PageNotFoundComponent } from './../../../../page-not-found.component';
import { TOASTR_TOKEN } from './../../../../core/services/external-libraries/toastr.service';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { IRoomsResponse } from './../../../../shared/interfaces/responses/rooms/rooms-response.interface';
import { RoomService } from './../../../../core/services/room.service';
import { IRoom } from './../../../../shared/interfaces/models/room.interface';
import { SimpleTableRow, SimpleTableColumn, SimpleTableRowCell } from './../../../../shared/components/simple-table/simple-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';

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
        private roomService: RoomService) {
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

    // @Input()rows: SimpleTableRow[] = [
    //     {
    //         rowID: 12,
    //         rowData: [
    //             {
    //                 columnName: 'First Name',
    //                 data: 'Robert'
    //             }, {
    //                 columnName: 'Last Name',
    //                 data: 'Bryan'
    //             }, {
    //                 columnName: 'Username',
    //                 data: 'rbryan21'
    //             }
    //         ]
    //     },
    //     {
    //         rowID: 13,
    //         rowData: [
    //             {
    //                 columnName: 'First Name',
    //                 data: 'Robert'
    //             }, {
    //                 columnName: 'Last Name',
    //                 data: 'Bryan'
    //             }, {
    //                 columnName: 'Username',
    //                 data: 'rbryan21'
    //             }
    //         ]
    //     }
    // ];

    buildTableData() {

        this.columns = [
          {
              name: 'Name',
              width: 1
          },
          {
              name: 'Description',
              width: 1
          }  
        ];

        console.log('columns equal ' + this.columns);

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

}

