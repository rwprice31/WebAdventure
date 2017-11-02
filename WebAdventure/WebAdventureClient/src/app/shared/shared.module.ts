import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SimpleModalComponent } from './components/simple-modal/simple-modal.component';
import { ModalTriggerDirective } from './directives/modal-trigger.directive';

@NgModule({
  declarations: [
    SimpleModalComponent,
    ModalTriggerDirective
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
    ModalTriggerDirective
  ]
})
export class SharedModule { }
