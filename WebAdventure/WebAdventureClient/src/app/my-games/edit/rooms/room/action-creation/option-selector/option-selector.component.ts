import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IActionOutcome } from '../../../../../../shared/interfaces/models/action-outcome.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IToastr } from '../../../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from '../../../../../../core/services/external-libraries/toastr.service';

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
