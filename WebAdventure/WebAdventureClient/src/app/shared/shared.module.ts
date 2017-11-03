import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SimpleModalComponent } from './components/simple-modal/simple-modal.component';
import { ModalTriggerDirective } from './directives/modal-trigger.directive';
import { GameCardComponent } from './components/game-card/game-card.component';
import { GameCardGridComponent } from './components/game-card-grid/game-card-grid.component';

@NgModule({
  declarations: [
    SimpleModalComponent,
    ModalTriggerDirective,
    GameCardComponent,
    GameCardGridComponent
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
    GameCardComponent,
    GameCardGridComponent
  ]
})
export class SharedModule { }
