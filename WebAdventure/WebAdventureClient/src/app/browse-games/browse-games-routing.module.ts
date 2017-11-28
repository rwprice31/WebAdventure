import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowseGamesComponent } from './browse-games.component';
import { PlayGameComponent } from './play/play.component';

// path's after /games/
const routes: Routes = [
    {
        path: '',
        component: BrowseGamesComponent,
    },
    {
        path: 'play/:id',
        loadChildren: 'app/browse-games/play/play.module#PlayModule'
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    providers: [ ],
    exports: [ RouterModule ]
})

export class BrowseGamesRoutingModule {
    static components = [ BrowseGamesComponent ];
}
