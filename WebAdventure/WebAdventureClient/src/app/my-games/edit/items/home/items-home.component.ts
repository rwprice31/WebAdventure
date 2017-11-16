import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TOASTR_TOKEN } from '../../../../core/services/external-libraries/toastr.service';
import { IToastr } from '../../../../shared/interfaces/external-libraries/toastr.interface';
import { ItemService } from '../../../../core/services/item.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { IItemType } from '../../../../shared/interfaces/models/item-type.interface';
import { IItemTypesResponse } from '../../../../shared/interfaces/responses/items/item-type.response.interface';

@Component({
  templateUrl: './items-home.component.html',
  styleUrls: ['./items-home.component.scss']
})
export class ItemsHomeComponent implements OnInit {

    private itemTypes: IItemType[];

    constructor(private router: Router,
        private route: ActivatedRoute,
        @Inject(TOASTR_TOKEN) private toastr: IToastr,
        private itemService: ItemService,
        private dialogService: DialogService) {
    }

    ngOnInit(): void {

    }

}
