import { GameRoomResolver } from './../../../core/services/resolvers/rooms/game-room-resolver.service';
import { GameRoomsResolver } from './../../../core/services/resolvers/rooms/game-rooms-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoomsComponent } from './rooms.component';
import { RoomsHomeComponent } from './home/rooms-home.component';
import { RoomComponent } from './room/room.component';

// after /my-games/edit/:gameId/rooms/
const routes: Routes = [
    { 
        path: '', 
        component: RoomsComponent,
        children: [
            { 
                path: ':id',
                component: RoomComponent,
                resolve: {
                    roomResponse: GameRoomResolver
                }
            },
            {
                path: '**', 
                component: RoomsHomeComponent, // redirect all other paths to create info
                // canDeactivate: [CanDeactivateGuard],
                resolve: {
                    roomsResponse: GameRoomsResolver 
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
export class RoomsRoutingModule {
    static components = [ RoomComponent, RoomsHomeComponent, RoomsComponent ];
 }
