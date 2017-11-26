import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './option-selector.component.html',
  styleUrls: ['./option-selector.component.scss']
})
export class OptionSelectorComponent {

  constructor(private router: Router,
    private route: ActivatedRoute) {

  }

  monsterSelected() {
    this.router.navigate(['../monster-option'], { relativeTo: this.route} );
  }

  itemSelected() {
    this.router.navigate(['../item-option'], { relativeTo: this.route} );
  }

  roomSelected() {
    this.router.navigate(['../room-option'], { relativeTo: this.route} );
  }

}
