import { Component, OnInit, Inject } from '@angular/core';
import { CanComponentDeactivate } from '../../../core/services/guards/can-deactivate-guard.service';
import { IPlayerOptions } from '../../../shared/interfaces/models/player-options.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TOASTR_TOKEN } from '../../../core/services/external-libraries/toastr.service';
import { IToastr } from '../../../shared/interfaces/external-libraries/toastr.interface';
import { DialogService } from '../../../core/services/dialog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './player-options.component.html',
  styleUrls: ['./player-options.component.scss']
})
export class PlayerOptionsComponent implements OnInit, CanComponentDeactivate  {
    
    playerOptions: IPlayerOptions;
    originalInfoForm: FormGroup;
    playerInfoForm: FormGroup;
    confirmNavigation: boolean;

    constructor(private formBuilder: FormBuilder,
        @Inject(TOASTR_TOKEN) private toastr: IToastr,
        private dialogService: DialogService,
        private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.retrievePlayerOptionsInfo();
    }

    private retrievePlayerOptionsInfo() {
        
    }

    private buildForm() {
        this.playerInfoForm = this.formBuilder.group({
            health: ['', Validators.required],
            speed: ['', Validators.required],
            attack: ['', Validators.required]
        });
        this.setFormValues();
    }

    private setFormValues() {
        this.playerInfoForm.setValue({
            health: this.playerOptions.health,
            speed: this.playerOptions.speed,
            attack: this.playerOptions.attack
        });
    }

    canDeactivate(): boolean {
        return false;
    }

}
