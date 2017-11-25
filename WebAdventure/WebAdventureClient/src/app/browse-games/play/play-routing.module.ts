import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayGameComponent } from './play.component';

const routes: Routes = [
    { 
        path: '', 
        component: PlayGameComponent,
    }
];

@NgModule({
    imports: [ ],
    providers: [ ],
    exports: [ RouterModule ]
})
export class PlayRoutingModule {
    static components = [ PlayGameComponent ];
 }