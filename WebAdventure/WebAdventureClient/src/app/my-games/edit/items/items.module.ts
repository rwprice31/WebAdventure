import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { ItemsRoutingModule } from './items-routing.module';

@NgModule({
  declarations: [
    ItemsRoutingModule.components
  ],
  imports: [
    SharedModule,
    ItemsRoutingModule
  ],
  providers: []
})
export class ItemsModule { }
