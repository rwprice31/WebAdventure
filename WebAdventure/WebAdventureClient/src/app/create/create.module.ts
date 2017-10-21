import { CreateRoutingModule } from './create-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';

import { CreateComponent } from "./create.component";
import { CreateInfoComponent } from "./info/create-info.component";

@NgModule({
  declarations: [
      CreateRoutingModule.components
  ],
  imports: [
    CreateRoutingModule
  ],
  providers: []
})
export class CreateModule { }
