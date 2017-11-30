import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room.component';
import { RoomExitComponent } from './exit/room-exit.component';
import { RoomMonsterComponent } from './monster/room-monster.component';
import { RoomItemComponent } from './item/room-item.component';
import { RoomsResolver } from '../../../../core/services/resolvers/rooms/rooms-resolver.service';
import { RoomExitResolver } from '../../../../core/services/resolvers/rooms/room-exit-resolver.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'room',
        pathMatch: 'full'
    },
    { 
        path: 'room', 
        component: RoomComponent,
        children: [
            {
                path: ':id',
                component: RoomExitComponent,
                outlet: 'exit',
                resolve: {
                    roomsResponse: RoomsResolver,
                    exitResponse: RoomExitResolver, 
                }
            },
            {
                path: ':id',
                component: RoomItemComponent,
                outlet: 'item'
            },
            {
                path: ':id',
                component: RoomMonsterComponent,
                outlet: 'monster'
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
export class RoomRoutingModule {
    static components = [ RoomComponent, RoomExitComponent, RoomItemComponent, RoomMonsterComponent ];
 }
