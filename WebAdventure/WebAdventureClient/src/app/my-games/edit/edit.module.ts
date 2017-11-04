import { EditRoutingModule } from './edit-routing.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    EditRoutingModule.components
  ],
  imports: [
    SharedModule,
    EditRoutingModule
  ],
  providers: []
})
export class EditModule { }
