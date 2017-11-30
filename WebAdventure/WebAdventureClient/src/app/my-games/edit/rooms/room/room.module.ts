import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { RoomRoutingModule } from './room-routing.module';

@NgModule({
  declarations: [
    RoomRoutingModule.components
  ],
  imports: [
    SharedModule,
    RoomRoutingModule
  ],
  providers: []
})
export class RoomModule { }
