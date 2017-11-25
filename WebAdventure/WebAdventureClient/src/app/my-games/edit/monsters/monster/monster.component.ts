import { IMonsterCreationResponse } from './../../../../shared/interfaces/responses/monsters/monster-creation-response.interface';
import { IGame } from './../../../../shared/interfaces/models/game.interface';
import { GameService } from './../../../../core/services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IToastr } from './../../../../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from './../../../../core/services/external-libraries/toastr.service';
import { DialogService } from './../../../../core/services/dialog.service';
import { MonsterService } from './../../../../core/services/monster.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMonsters } from './../../../../shared/interfaces/models/monsters.interface';
import { Component, Inject, OnInit } from '@angular/core';
import { IMonsterViewModel } from '../../../../shared/interfaces/view-models/monsters/monster-view-model.interface';
import { IMonsterResponse } from '../../../../shared/interfaces/responses/monsters/monster-response.interface';
import * as _ from 'lodash';
import { CanComponentDeactivate } from '../../../../core/services/guards/can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';
import { compareFormGroupValues } from '../../../../shared/functions/copy-form-group';
import { IMonsterUpdatingViewModel } from '../../../../shared/interfaces/view-models/monsters/monster-updating-view-model.interface';
import { IMonsterUpdatingResponse } from '../../../../shared/interfaces/responses/monsters/monster-updating-response.interface';

@Component({
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.scss']
})
export class MonsterComponent implements OnInit, CanComponentDeactivate {

    private monster: IMonsters;
    private monsterInfoForm: FormGroup;
    private originalMonsterInfoForm: FormGroup;
    private confirmNavigation: boolean;
    private monsterId: number;
    private gameId: number;
    private isUpdating: boolean;
  
    constructor(private formBuilder: FormBuilder,
      private monsterService: MonsterService,
      private gameService: GameService,
      private dialogService: DialogService,
      @Inject(TOASTR_TOKEN) private toastr: IToastr,
      private router: Router,
      private route: ActivatedRoute) {
          this.buildForm();
    }
  
    ngOnInit() {
      this.monsterId = this.monsterService.getCurrentEdittingMonsterFromSessionStorage();
      if (this.monsterId === 0) {
        this.isUpdating = false;
      } else {
        this.isUpdating = true;
        this.retrieveMonster();
      }
      this.gameId = this.gameService.getGameIdUsersCurrentlyEdittingFromSessionStorage();
    }

    private retrieveMonster(): void {
      this.route.data.subscribe( (data: { monsterResponse: IMonsterResponse }) => {
        if (data.monsterResponse.status) {
            this.monster = data.monsterResponse.monster;
            this.setFormValues();
        } else {
            this.toastr.error(data.monsterResponse.statusText);
        }
      });
    }
  
    private buildForm(): void {
      this.monsterInfoForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['']
      });
    }

    private setFormValues(): void {
      this.monsterInfoForm.setValue({
        name: this.monster.name,
        description: this.monster.descr
      });
      this.originalMonsterInfoForm = _.cloneDeep(this.monsterInfoForm);
    }

    private submit() {
      if (!this.monster) {
        this.createMonster();
      } else {
        this.updateMonster();
      }
    }

    private createMonster() {
      let monster: IMonsters = {
        id: 0,
        name: this.monsterInfoForm.controls['name'].value,
        descr: this.monsterInfoForm.controls['description'].value,
        health: this.monsterInfoForm.controls['health'].value,
        MinDamage: this.monsterInfoForm.controls['MinDamage'].value,
        MaxDamage: this.monsterInfoForm.controls['MaxDamage'].value,
        Speed: this.monsterInfoForm.controls['Speed'].value,
        AttackDescr: this.monsterInfoForm.controls['AttackDescription'].value,
        //actions: null,
        gameId:  this.gameId
      };
      this.monsterService.createMonster(monster).subscribe( 
        (res: IMonsterCreationResponse) => {
          if (res.status) {
            this.monster = res.monster;
            this.setFormValues();
            this.toastr.success(res.statusText);
            this.router.navigate(['../'], { relativeTo: this.route});
          } else {
            this.toastr.error(res.statusText);
          }
      });
    }

    private updateMonster() {
      let monster: IMonsterUpdatingViewModel = {
        id: this.monsterId,
        name: this.monsterInfoForm.controls['name'].value,
        descr: this.monsterInfoForm.controls['description'].value,
        health: this.monsterInfoForm.controls['health'].value,
        MinDamage: this.monsterInfoForm.controls['MinDamage'].value,
        MaxDamage: this.monsterInfoForm.controls['MaxDamage'].value,
        Speed: this.monsterInfoForm.controls['Speed'].value,
        AttackDescr: this.monsterInfoForm.controls['AttackDescription'].value,
        gameId: this.gameId
      };
      this.monsterService.updateMonster(monster).subscribe(
        (res: IMonsterUpdatingResponse) => {
          if (res.status) {
            this.monster = res.monster;
            this.setFormValues();
            this.toastr.success(res.statusText);
            this.router.navigate(['../'], { relativeTo: this.route });
          } else {
            this.toastr.error(res.statusText);
          }
        }
      );
    }

    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
      // only prompt for message if values have changed
      if (!compareFormGroupValues(this.originalMonsterInfoForm, this.monsterInfoForm)) {
        return this.dialogService.confirm('Leave and lose unsaved changes?');
      } else {
        return true;
      }
    }

}
