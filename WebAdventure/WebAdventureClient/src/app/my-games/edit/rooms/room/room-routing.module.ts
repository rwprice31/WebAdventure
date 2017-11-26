import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoomComponent } from './room.component';

// after /my-games/edit/:gameId/rooms/:roomId/
const routes: Routes = [
    { 
        path: '', 
        component: RoomComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/my-games/edit/rooms/room/action-creation/action-creation.module#ActionCreationModule'
            },
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
    static components = [ RoomComponent ];
 }
