import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { RoomsRoutingModule } from './rooms-routing.module';

@NgModule({
  declarations: [
    RoomsRoutingModule.components
  ],
  imports: [
    SharedModule,
    RoomsRoutingModule
  ],
  providers: []
})
export class RoomsModule { }
