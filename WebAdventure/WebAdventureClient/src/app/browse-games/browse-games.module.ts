import { BrowseGamesRoutingModule } from './browse-games-routing.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        BrowseGamesRoutingModule.components
    ],
    imports: [
        SharedModule,
        BrowseGamesRoutingModule
    ],
    providers: []
})
export class BrowseGamesModule {}