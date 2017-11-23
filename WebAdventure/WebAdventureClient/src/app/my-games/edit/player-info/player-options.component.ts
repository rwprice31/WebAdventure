import { Component, OnInit, Inject } from '@angular/core';
import { CanComponentDeactivate } from '../../../core/services/guards/can-deactivate-guard.service';
import { IPlayerOptions } from '../../../shared/interfaces/models/player-options.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TOASTR_TOKEN } from '../../../core/services/external-libraries/toastr.service';
import { IToastr } from '../../../shared/interfaces/external-libraries/toastr.interface';
import { DialogService } from '../../../core/services/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { IPlayerOptionsResponse } from '../../../shared/interfaces/responses/player-options/players-options-response.interface';
import { PlayerOptionsService } from '../../../core/services/player-options.service';
import { IPlayerOptionsViewModel } from '../../../shared/interfaces/view-models/player-options/player-options-view-model.interface';
import { IPlayerOptionsCreationViewModel } from '../../../shared/interfaces/view-models/player-options/player-options-creation-view-model.interface';
import { IPlayerOptionsCreationResponse } from '../../../shared/interfaces/responses/player-options/player-options-creation-response.interface';
import { IPlayerOptionsUpdationViewModel } from '../../../shared/interfaces/view-models/player-options/player-options-updation-view-model.interface';
import { IPlayerOptionsUpdationResponse } from '../../../shared/interfaces/responses/player-options/player-options-updation-response.interface';
import * as _ from 'lodash';

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
        private route: ActivatedRoute,
        private playerOptionsService: PlayerOptionsService) {

    }

    ngOnInit(): void {
        this.buildForm();
        this.retrievePlayerOptions();
    }

    private retrievePlayerOptionsInfo() {
        this.buildForm();
    }

    private buildForm() {
        this.playerInfoForm = this.formBuilder.group({
            health: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            speed: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            attack: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
        });
    }

    private retrievePlayerOptions() {
        this.route.data.subscribe( (data: { playerOptionsResponse: IPlayerOptionsResponse }) => {
            if (data.playerOptionsResponse.status) {
                this.playerOptions = data.playerOptionsResponse.player;
                if (this.playerOptions) {
                    this.setFormValues();
                } 
            } else {
                this.toastr.error(data.playerOptionsResponse.statusText);
            }
        });
    }

    private setFormValues(): void {
        this.playerInfoForm.setValue({
            health: this.playerOptions.health,
            speed: this.playerOptions.speed,
            attack: this.playerOptions.attack
        });
        this.originalInfoForm = _.cloneDeep(this.playerInfoForm);
    }

    private submit(): void {
        if (!this.playerOptions) {
            this.createPlayerOptions();
        } else {
            this.updatePlayerOptions();
        }
    }

    private createPlayerOptions(): void {
        let playerOptions: IPlayerOptionsCreationViewModel = {
            id: 0,
            health: +this.playerInfoForm.controls['health'].value,
            speed: +this.playerInfoForm.controls['speed'].value,
            attack: +this.playerInfoForm.controls['attack'].value,
        };
        this.playerOptionsService.createPlayerOptions(playerOptions).subscribe(
            (res: IPlayerOptionsCreationResponse) => {
                if (res.status) {
                    this.playerOptions = res.player;
                    this.setFormValues();
                    this.toastr.success(res.statusText);
                } else {
                    this.toastr.error(res.statusText);
                }
            }
        );
    }

    private updatePlayerOptions(): void {
        let playerOptions: IPlayerOptionsUpdationViewModel = {
            id: this.playerOptions.id,
            health: +this.playerInfoForm.controls['health'].value,
            speed: +this.playerInfoForm.controls['speed'].value,
            attack: +this.playerInfoForm.controls['attack'].value,
        };
        this.playerOptionsService.updatePlayerOptions(playerOptions).subscribe(
            (res: IPlayerOptionsUpdationResponse) => {
                if (res.status) {
                    this.playerOptions = res.player;
                    this.setFormValues();
                    this.toastr.success(res.statusText);
                } else {
                    this.toastr.error(res.statusText);
                }
            }
        );
    }

    canDeactivate(): boolean {
        return false;
    }

}
