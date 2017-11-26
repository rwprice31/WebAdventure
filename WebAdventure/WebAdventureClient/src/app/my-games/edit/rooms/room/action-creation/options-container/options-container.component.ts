import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IActionOutcome } from '../../../../../../shared/interfaces/models/action-outcome.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TOASTR_TOKEN } from '../../../../../../core/services/external-libraries/toastr.service';
import { IToastr } from '../../../../../../shared/interfaces/external-libraries/toastr.interface';

@Component({
  templateUrl: './options-container.component.html',
  styleUrls: ['./options-container.component.scss']
})
export class OptionsContainerComponent {

  private actionOutcome: IActionOutcome;
  private actionForm: FormGroup;
  private originalActionFormInfo: FormGroup;
  private roomId: number;
  private gameId: number;
  private isUpdating: boolean;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
    this.buildForm();
  }

  private buildForm(): void {
    this.actionForm = this.formBuilder.group({
      userInput: ['', Validators.required]
    }); 
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
