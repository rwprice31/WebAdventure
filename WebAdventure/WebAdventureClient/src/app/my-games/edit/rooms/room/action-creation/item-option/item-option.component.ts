import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IItemsResponse } from '../../../../../../shared/interfaces/responses/items/items-response.interface';
import { IItem } from '../../../../../../shared/interfaces/models/item.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IToastr } from '../../../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from '../../../../../../core/services/external-libraries/toastr.service';

@Component({
  templateUrl: './item-option.component.html',
  styleUrls: ['./item-option.component.scss']
})
export class ItemOptionComponent implements OnInit {
  
  private items: IItem[];
  private itemSelectionForm: FormGroup;

  constructor(private route: ActivatedRoute,
  private formBuilder: FormBuilder,
  @Inject(TOASTR_TOKEN) private toastr: IToastr) {
    
  }

  ngOnInit(): void {
    this.retrieveItems();
    this.buildForm();
  }

  private buildForm() {
    this.itemSelectionForm = this.formBuilder.group({
      item: ['', Validators.required]
    });
  }

  retrieveItems(): void {
    this.route.data.subscribe( (data: { itemsResponse: IItemsResponse }) => {
      if (data.itemsResponse.status) {
        this.items = data.itemsResponse.items;
        console.log('This items = ' + this.items);
      } else {
        this.toastr.error(data.itemsResponse.statusText);
      }
    });
  }
    
}
