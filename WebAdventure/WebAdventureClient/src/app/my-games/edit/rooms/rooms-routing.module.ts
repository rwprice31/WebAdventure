import { RoomResolver } from './../../../core/services/resolvers/rooms/room-resolver.service';
import { RoomsResolver } from './../../../core/services/resolvers/rooms/rooms-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoomsComponent } from './rooms.component';
import { RoomsHomeComponent } from './home/rooms-home.component';
import { RoomComponent } from './room/room.component';
import { CanDeactivateGuard } from '../../../core/services/guards/can-deactivate-guard.service';

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
                    roomResponse: RoomResolver
                },
                canDeactivate: [ CanDeactivateGuard ]
            },
            {
                path: '**', 
                component: RoomsHomeComponent, // redirect all other paths to create info
                // canDeactivate: [CanDeactivateGuard],
                resolve: {
                    roomsResponse: RoomsResolver 
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
