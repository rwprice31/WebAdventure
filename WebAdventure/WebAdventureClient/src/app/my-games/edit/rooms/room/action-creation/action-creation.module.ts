import { SharedModule } from './../../../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { ActionCreationRoutingModule } from './action-creation-routing.module';

@NgModule({
  declarations: [
    ActionCreationRoutingModule.components
  ],
  imports: [
    SharedModule,
    ActionCreationRoutingModule
  ],
  providers: []
})
export class ActionCreationModule { }
