import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayGameComponent } from './play.component';

// after /games/play/
const routes: Routes = [
    { 
        path: '', 
        component: PlayGameComponent
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
    static components = [ PlayGameComponent ];
}
