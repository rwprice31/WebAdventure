import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { MonstersRoutingModule } from './monsters-routing.module';

@NgModule({
  declarations: [
    MonstersRoutingModule.components
  ],
  imports: [
    SharedModule,
    MonstersRoutingModule
  ],
  providers: []
})
export class MonstersModule { }
