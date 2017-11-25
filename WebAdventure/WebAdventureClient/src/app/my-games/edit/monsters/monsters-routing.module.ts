import { MonsterResolver } from './../../../core/services/resolvers/monsters/monster-resolver.service';
import { MonstersResolver } from './../../../core/services/resolvers/monsters/monsters-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MonstersComponent } from './monsters.component';
import { MonstersHomeComponent } from './home/monsters-home.component';
import { MonsterComponent } from './monster/monster.component';
import { CanDeactivateGuard } from '../../../core/services/guards/can-deactivate-guard.service';


const routes: Routes = [
    { 
        path: '', 
        component: MonstersComponent,
        children: [
            { 
                path: ':id',
                component: MonsterComponent,
                resolve: {
                    monsterResponse: MonsterResolver
                },
                canDeactivate: [ CanDeactivateGuard ]
            },
            {
                path: '**', 
                component: MonstersHomeComponent, 
                resolve: {
                    monstersResponse: MonstersResolver 
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
export class MonstersRoutingModule {
    static components = [ MonstersComponent, MonstersHomeComponent, MonsterComponent ];
 }
