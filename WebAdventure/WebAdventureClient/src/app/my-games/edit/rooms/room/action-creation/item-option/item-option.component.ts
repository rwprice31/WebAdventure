import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IItemsResponse } from '../../../../../../shared/interfaces/responses/items/items-response.interface';
import { IItem } from '../../../../../../shared/interfaces/models/item.interface';

@Component({
  templateUrl: './item-option.component.html',
  styleUrls: ['./item-option.component.scss']
})
export class ItemOptionComponent implements OnInit {
  
  private items: IItem[];

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.retrieveItems();
  }

  retrieveItems(): void {
    this.route.data.subscribe( (data: { itemsResponse: IItemsResponse }) => {
      if (data.itemsResponse.status) {
        this.items = data.itemsResponse.items;
      } else {
        
      }
    });
  }
    
}
