import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayGameComponent } from './play.component';
import { PlayRoomComponent } from './room/play-room.component';

// after /games/play/
const routes: Routes = [
    { 
        path: '', 
        component: PlayGameComponent,
        children: [ {
            path:':playerGameId/:roomId',
            component:PlayRoomComponent
        }]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: [ ],
    exports: [ RouterModule ]
})
export class PlayRoutingModule {
    static components = [ PlayGameComponent, PlayRoomComponent ];
}
