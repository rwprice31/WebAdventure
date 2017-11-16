import { GameRoomResolver } from './../../../core/services/resolvers/rooms/game-room-resolver.service';
import { GameRoomsResolver } from './../../../core/services/resolvers/rooms/game-rooms-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items.component';
import { ItemComponent } from './item/item.component';
import { ItemsHomeComponent } from './home/items-home.component';
import { ItemTypesResolver } from '../../../core/services/resolvers/items/item-types-resolver.service';



// after /my-games/edit/:gameId/items/
const routes: Routes = [
    { 
        path: '', 
        component: ItemsComponent,
        children: [
            { 
                path: ':id',
                component: ItemComponent,
                resolve: {
                    itemTypesResponse: ItemTypesResolver 
                }
            },
            {
                path: '**', 
                component: ItemsHomeComponent, // redirect all other paths to create info
                // canDeactivate: [CanDeactivateGuard],
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
export class ItemsRoutingModule {
    static components = [ ItemsComponent, ItemsHomeComponent, ItemComponent ];
 }
