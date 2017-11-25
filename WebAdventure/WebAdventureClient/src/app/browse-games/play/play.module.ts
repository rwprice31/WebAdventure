import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PlayRoutingModule } from './play-routing.module';

@NgModule({
  declarations: [
    PlayRoutingModule.components
  ],
  imports: [
    SharedModule,
    PlayRoutingModule
  ],
  providers: []
})
export class PlayModule { }
