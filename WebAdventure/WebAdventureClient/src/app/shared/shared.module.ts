import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SimpleModalComponent } from './components/simple-modal/simple-modal.component';
import { ModalTriggerDirective } from './directives/modal-trigger.directive';
import { GameCardComponent } from './components/game-card/game-card.component';

@NgModule({
  declarations: [
    SimpleModalComponent,
    ModalTriggerDirective,
    GameCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleModalComponent,
    ModalTriggerDirective,
    GameCardComponent
  ]
})
export class SharedModule { }
