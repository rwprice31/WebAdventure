import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyGamesComponent } from './my-games.component';
import { MyGamesHomeComponent } from './home/my-games-home.component';
import { MyGamesNewComponent } from './new/my-games-new.component';
import { UsersCreatedGamesResolver } from '../core/services/resolvers/games/users-created-games-resolver.service';

// path's after /my-games/
const routes: Routes = [
    { 
        path: '', 
        component: MyGamesComponent,
        children: [
            {
                path: 'new',
                component: MyGamesNewComponent
            },
            { 
                path: 'edit/:id',
                loadChildren: 'app/my-games/edit/edit.module#EditModule'
            },
            {
                path: '**',
                component: MyGamesHomeComponent,
                resolve: {
                    gamesResponse: UsersCreatedGamesResolver
                } 
            }
        ]
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    providers: [ ],
    exports: [ RouterModule ]
})
export class MyGamesRoutingModule {
    static components = [ MyGamesComponent, MyGamesHomeComponent, MyGamesNewComponent ];
 }
