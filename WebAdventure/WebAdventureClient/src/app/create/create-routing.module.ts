import { MonsterComponent } from './monster/monster.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateInfoComponent } from './info/create-info.component';
import { CreateComponent } from "./create.component";

const routes: Routes = [
    { 
        path: '', 
        component: CreateComponent,
        children: [
            {
                path: 'info', component: CreateInfoComponent
            },
            {
                path: 'monster', component: MonsterComponent
            },
            {
                path: '', component: CreateInfoComponent
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
export class CreateRoutingModule {
    static components = [ CreateComponent, CreateInfoComponent, MonsterComponent ];
 }
