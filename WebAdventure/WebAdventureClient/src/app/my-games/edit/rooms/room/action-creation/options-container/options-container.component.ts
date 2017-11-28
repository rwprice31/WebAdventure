import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IActionOutcome } from '../../../../../../shared/interfaces/models/action-outcome.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TOASTR_TOKEN } from '../../../../../../core/services/external-libraries/toastr.service';
import { IToastr } from '../../../../../../shared/interfaces/external-libraries/toastr.interface';
import { RoomActionOutcomeService } from '../../../../../../core/services/room-action-outcome.service';
import { IOutcome } from '../../../../../../shared/interfaces/models/outcome.interface';

@Component({
  templateUrl: './options-container.component.html',
  styleUrls: ['./options-container.component.scss']
})
export class OptionsContainerComponent implements OnInit {

  private actionOutcome: IActionOutcome;
  private outcome: IOutcome;
  private actionForm: FormGroup;
  private originalActionFormInfo: FormGroup;
  private roomId: number;
  private gameId: number;
  private isUpdating: boolean;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private roomActionOutcome: RoomActionOutcomeService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
    this.buildForm();
  }

  public ngOnInit() {
    
  }

  private fetchActionOutcome() {
    this.outcome = this.roomActionOutcome.getCurrentOutcomeSessionStorage();
  }

  private buildForm(): void {
    this.actionForm = this.formBuilder.group({
      userInput: ['', Validators.required]
    }); 
  }

  private cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private formUpdated($event) {
    console.log('Form updated = ' + $event);
  }

  private inputChanged($event) {
    console.log('input changed: ' + $event);
  }

  private actionOptionInvalid(): boolean {
    this.fetchActionOutcome();
    if (!this.actionForm.valid || !(this.outcome.item || this.outcome.room)) {
      return true;
    }
    // console.log('Fetch action outcome = ' + JSON.stringify(this.outcome));
    return false;
  }

  private createActionOutcome() {
  
  }

}
