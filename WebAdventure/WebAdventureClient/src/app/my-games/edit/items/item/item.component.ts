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
import { IItemCreationViewModel } from '../../../../shared/interfaces/view-models/items/item-creation-view-model.interface';
import { IItemCreationResponse } from '../../../../shared/interfaces/responses/items/item-creation-response.interface';
import { IItemResponse } from '../../../../shared/interfaces/responses/items/item-response.interface';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { compareFormGroupValues } from '../../../../shared/functions/copy-form-group';
import { CanComponentDeactivate } from '../../../../core/services/guards/can-deactivate-guard.service';
import { IItemUpdationViewModel } from '../../../../shared/interfaces/view-models/items/item-updation-view-model.interface';
import { IItemUpdationResponse } from '../../../../shared/interfaces/responses/items/item-updation-response.interface';

@Component({
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, CanComponentDeactivate {

    private item: IItem;
    private itemId: number;
    private itemInfoForm: FormGroup;
    private originalItemInfoForm: FormGroup;
    private itemTypes: IItemType[];
    private gameId: number;
    private isUpdating: boolean;

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
        this.itemId = this.itemService.getCurrentEdittingItemFromSessionStorage();
        if (this.itemId === 0) {
            this.isUpdating = false;
        } else {
            this.isUpdating = true;
            this.retrieveItem();
        }
    }

    private buildForm(): void {
        this.itemInfoForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            type: ['', Validators.required],
            points: ['', Validators.pattern(/^\d+$/)]
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

    private submit(): void {
        if (!this.item) {
            this.createItem();
        } else {
            this.updateItem();
        }
    }

    private createItem(): void {
        let item: IItemCreationViewModel = {
            id: 0,
            name: this.itemInfoForm.controls['name'].value,
            descr: this.itemInfoForm.controls['description'].value,
            type: {
                type: this.itemInfoForm.controls['type'].value
            },
            points: this.itemInfoForm.controls['points'].value
        };
        this.itemService.createItem(item).subscribe(
            (res: IItemCreationResponse) => {
                if (res.status) {
                    this.toastr.success(res.statusText);
                    console.log('Created item = ' + JSON.stringify(res.item));
                    this.item = res.item;
                    this.setFormValues();
                    this.router.navigate(['../'], { relativeTo: this.route });
                } else {
                    this.toastr.error(res.statusText);
                }
            }
        );
    }

    private updateItem(): void {
        let item: IItemUpdationViewModel = {
            id: this.item.id,
            name: this.itemInfoForm.controls['name'].value,
            descr: this.itemInfoForm.controls['description'].value,
            type: {
                type: this.itemInfoForm.controls['type'].value
            },
            points: this.itemInfoForm.controls['points'].value
        };
        this.itemService.updateItem(item).subscribe(
            (res: IItemUpdationResponse) => {
                if (res.status) {
                    this.item = res.item;
                    this.setFormValues();
                    this.toastr.success(res.statusText);
                    this.router.navigate(['../'], { relativeTo: this.route });
                } else {
                    this.toastr.error(res.statusText);
                }
            }
        );
    }

    private retrieveItem(): void {
        this.route.data.subscribe( (data: { itemResponse: IItemResponse }) => {
              if (data.itemResponse.status) {
                  this.item = data.itemResponse.item;
                  this.setFormValues();
                  console.log('This item = ' + JSON.stringify(this.item));
              } else {
                  this.toastr.error(data.itemResponse.statusText);
              }
            });
    }

    private setFormValues(): void {
        this.itemInfoForm.setValue({
            name: this.item.name,
            description: this.item.descr,
            type: this.item.type.type,
            points: this.item.points
        });
        this.originalItemInfoForm = _.cloneDeep(this.itemInfoForm);
    }

    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
        // only prompt for message if values have changed
        if (!compareFormGroupValues(this.originalItemInfoForm, this.itemInfoForm)) {
          return this.dialogService.confirm('Leave and lose unsaved changes?');
        } else {
          return true;
        }
      }

}
