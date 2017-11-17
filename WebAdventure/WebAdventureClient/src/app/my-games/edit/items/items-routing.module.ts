import { RoomResolver } from './../../../core/services/resolvers/rooms/room-resolver.service';
import { RoomsResolver } from './../../../core/services/resolvers/rooms/rooms-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items.component';
import { ItemComponent } from './item/item.component';
import { ItemsHomeComponent } from './home/items-home.component';
import { ItemTypesResolver } from '../../../core/services/resolvers/items/item-types-resolver.service';
import { ItemResolver } from '../../../core/services/resolvers/items/item-resolver.service';
import { ItemsResolver } from '../../../core/services/resolvers/items/items-resolver.service';



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
                    itemTypesResponse: ItemTypesResolver,
                    itemResponse: ItemResolver 
                }
            },
            {
                path: '**', 
                component: ItemsHomeComponent,
                resolve: {
                    itemsResponse: ItemsResolver
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
export class ItemsRoutingModule {
    static components = [ ItemsComponent, ItemsHomeComponent, ItemComponent ];
 }
