import { EditGuard } from './../../core/services/guards/edit-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from './../../core/services/guards/can-deactivate-guard.service';

import { EditComponent } from './edit.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { GameInfoResolver } from '../../core/services/resolvers/games/edit/game-info-resolver.service';
import { GameGenresResolver } from '../../core/services/resolvers/genres/game-genre.resolver.service';
import { PlayerOptionsComponent } from './player-info/player-options.component';
import { PlayerOptionsResolver } from '../../core/services/resolvers/player-options/player-options-resolver.service';

// path's after /create/
const routes: Routes = [
    { 
        path: '', 
        component: EditComponent,
        canActivate: [ EditGuard ],
        children: [
            { 
                path: 'rooms',
                loadChildren: 'app/my-games/edit/rooms/rooms.module#RoomsModule'
            },
            {
                path: 'items',
                loadChildren: 'app/my-games/edit/items/items.module#ItemsModule'
            },
            {
                path: 'player-options',
                component: PlayerOptionsComponent,
                resolve: {
                    playerOptionsResponse: PlayerOptionsResolver
                }
            },
            {
                path: '**', 
                component: GameInfoComponent, // redirect all other paths to create info
                canDeactivate: [CanDeactivateGuard],
                resolve: {
                    gameResponse: GameInfoResolver,
                    genresResponse: GameGenresResolver
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
export class EditRoutingModule {
    static components = [ EditComponent, GameInfoComponent, PlayerOptionsComponent ];
 }
