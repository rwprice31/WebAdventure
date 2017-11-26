import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ActionCreationComponent } from './action-creation.component';
import { ItemsResolver } from '../../../../../core/services/resolvers/items/items-resolver.service';
import { RoomsResolver } from '../../../../../core/services/resolvers/rooms/rooms-resolver.service';
import { OptionSelectorComponent } from './option-selector/option-selector.component';
import { ItemOptionComponent } from './item-option/item-option.component';
import { MonsterOptionComponent } from './monster-option/monster-option.component';
import { RoomOptionComponent } from './room-option/room-option.component';
import { NewActionComponent } from './new-action/new-action.component';
import { OptionsContainerComponent } from './options-container/options-container.component';

// after /my-games/edit/:gameId/rooms/:roomId/
const routes: Routes = [
    { 
        path: '', 
        component: ActionCreationComponent,
        children: [
            {
                path: '',
                component: NewActionComponent
            },
            {
                path: 'options',
                component: OptionsContainerComponent,
                children: [
                    {
                        path: '',
                        component: OptionSelectorComponent
                    },
                    {
                        path: 'item-option',
                        component: ItemOptionComponent,
                        resolve: {
                            itemsResponse: ItemsResolver
                        }
                    },
                    {
                        path: 'monster-option',
                        component: MonsterOptionComponent,
                        resolve: {
                            // monstersResponse: MonstersResolver
                        }
                    },
                    {
                        path: 'room-option',
                        component: RoomOptionComponent,
                        resolve: {
                            roomsResponse: RoomsResolver
                        }
                    },
                ]
            },
            // {
            //     path: 'option-selector',
            //     component: OptionSelectorComponent
            // },
            // {
            //     path: 'item-option',
            //     component: ItemOptionComponent,
            //     resolve: {
            //         itemsResponse: ItemsResolver
            //     }
            // },
            // {
            //     path: 'monster-option',
            //     component: MonsterOptionComponent,
            //     resolve: {
            //         // monstersResponse: MonstersResolver
            //     }
            // },
            // {
            //     path: 'room-option',
            //     component: RoomOptionComponent,
            //     resolve: {
            //         roomsResponse: RoomsResolver
            //     }
            // },
            {
                path: '**',
                redirectTo: ''
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
export class ActionCreationRoutingModule {
    static components = [ ActionCreationComponent, NewActionComponent, ItemOptionComponent, MonsterOptionComponent, RoomOptionComponent, OptionSelectorComponent, OptionsContainerComponent ];
 }
