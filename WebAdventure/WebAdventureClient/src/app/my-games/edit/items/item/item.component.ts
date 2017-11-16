import { Component, Inject, OnInit } from '@angular/core';
import { IItem } from '../../../../shared/interfaces/models/item.interface';
import { IItemType } from '../../../../shared/interfaces/models/item-type.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../../../core/services/item.service';
import { GameService } from '../../../../core/services/game.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { IToastr } from '../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from '../../../../core/services/external-libraries/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IItemTypesResponse } from '../../../../shared/interfaces/responses/items/item-type.response.interface';

@Component({
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

    private item: IItem;
    private itemInfoForm: FormGroup;
    private originalItemInfoForm: FormGroup;
    private itemTypes: IItemType[];
    private gameId: number;

    constructor(private formBuilder: FormBuilder,
        private itemService: ItemService,
        private gameService: GameService,
        private dialogService: DialogService,
        @Inject(TOASTR_TOKEN) private toastr: IToastr,
        private router: Router,
        private route: ActivatedRoute) {
            this.buildForm();
    }

    ngOnInit(): void {
        this.retrieveItemTypes();
    }

    private buildForm(): void {
        this.itemInfoForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            type: ['', Validators.required],
            points: ['']
          });
    }

    private retrieveItemTypes(): void {
        this.route.data.subscribe( (data: { itemTypesResponse: IItemTypesResponse }) => {
            if (data.itemTypesResponse.status) {
                this.itemTypes = data.itemTypesResponse.itemTypes;
                console.log('This item types = ' + JSON.stringify(this.itemTypes));
            } else {
                this.toastr.error(data.itemTypesResponse.statusText);
            }
          });        
    }

}
