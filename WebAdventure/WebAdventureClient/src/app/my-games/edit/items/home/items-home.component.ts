import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TOASTR_TOKEN } from '../../../../core/services/external-libraries/toastr.service';
import { IToastr } from '../../../../shared/interfaces/external-libraries/toastr.interface';
import { ItemService } from '../../../../core/services/item.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { IItemType } from '../../../../shared/interfaces/models/item-type.interface';
import { IItemTypesResponse } from '../../../../shared/interfaces/responses/items/item-type.response.interface';
import { IItemsResponse } from '../../../../shared/interfaces/responses/items/items-response.interface';
import { IItem } from '../../../../shared/interfaces/models/item.interface';
import { SimpleTableColumn, SimpleTableRow } from '../../../../shared/components/simple-table/simple-table.component';

@Component({
  templateUrl: './items-home.component.html',
  styleUrls: ['./items-home.component.scss']
})
export class ItemsHomeComponent implements OnInit {

    private itemTypes: IItemType[];
    private items: IItem[];

    private columns: SimpleTableColumn[] = [];
    private rows: SimpleTableRow[] = [];

    constructor(private router: Router,
        private route: ActivatedRoute,
        @Inject(TOASTR_TOKEN) private toastr: IToastr,
        private itemService: ItemService,
        private dialogService: DialogService) {
    }

    ngOnInit(): void {
        this.retrieveItems();
        this.buildTableData();
    }

    private retrieveItems(): void {
        this.route.data.subscribe( (data: { itemsResponse: IItemsResponse }) => {
            if (data.itemsResponse.status) {
                this.items = data.itemsResponse.items;
                console.log('This items = ' + JSON.stringify(this.items));
            } else {
                this.toastr.error(data.itemsResponse.statusText);
            }
        });
    }

    private buildTableData(): void {
        this.columns = [
            {
                name: 'Name',
            },
            {
                name: 'Description',
            },
            {
                name: 'Type',
            },
            {
                name: 'Points'
            }
        ];
        
        this.items.forEach(item => {
            this.rows.push({
                rowID: item.id,
                rowData: [
                    {
                        columnName: 'Name',
                        data: item.name
                    },
                    {
                        columnName: 'Description',
                        data: item.descr
                    },
                    {
                        columnName: 'Type',
                        data: item.type.type
                    },
                    {
                        columnName: 'Points',
                        data: item.points.toString()
                    }
                ]
            });
        });
    }

}
