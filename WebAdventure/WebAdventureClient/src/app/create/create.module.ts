import { CreateRoutingModule } from './create-routing.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
      CreateRoutingModule.components
  ],
  imports: [
    SharedModule,
    CreateRoutingModule
  ],
  providers: []
})
export class CreateModule { }
