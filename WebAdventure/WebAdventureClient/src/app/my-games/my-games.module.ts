import { MyGamesRoutingModule } from './my-games-routing.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MyGamesRoutingModule.components
  ],
  imports: [
    SharedModule,
    MyGamesRoutingModule
  ],
  providers: []
})
export class MyGamesModule { }
