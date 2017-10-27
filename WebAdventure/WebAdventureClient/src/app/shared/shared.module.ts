import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EqualValidator } from './directives/equal-validator.directive';

@NgModule({
  declarations: [
    EqualValidator
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
    EqualValidator
  ]
})
export class SharedModule { }
