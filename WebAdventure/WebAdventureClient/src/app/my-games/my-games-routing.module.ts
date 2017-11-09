import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyGamesComponent } from './my-games.component';
import { MyGamesHomeComponent } from './home/my-games-home.component';
import { MyGamesNewComponent } from './new/my-games-new.component';
import { UsersCreatedGamesResolver } from '../core/services/resolvers/users-created-games-resolver.service';

// path's after /my-games/
const routes: Routes = [
    { 
        path: '', 
        component: MyGamesComponent,
        resolve: {
            games: UsersCreatedGamesResolver
        },
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
                component: MyGamesHomeComponent 
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
