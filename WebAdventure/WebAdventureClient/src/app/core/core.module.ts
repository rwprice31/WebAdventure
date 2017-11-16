import { GameRoomResolver } from './services/resolvers/rooms/game-room-resolver.service';
import { RoomService } from './services/room.service';
import { GameRoomsResolver } from './services/resolvers/rooms/game-rooms-resolver.service';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './services/auth-interceptor.service';

import { GameService } from './services/game.service';
import { GenreService } from './services/genre.service';
import { UserService } from './services/user.service';
import { ConfigService } from './services/utils/config.service';
import { DialogService } from './services/dialog.service';
import { CanDeactivateGuard } from './services/guards/can-deactivate-guard.service';

import { AuthGuard } from './services/guards/auth-guard.service';
import { NotAlreadyLoggedInGuard } from './services/guards/not-already-logged-in-guard.service';
import { EditGuard } from './services/guards/edit-guard.service';

import { TOASTR_TOKEN } from './services/external-libraries/toastr.service';
import { JQ_TOKEN } from './services/external-libraries/jQuery.service';

import { IToastr } from '../shared/interfaces/external-libraries/toastr.interface';

import { EnsureModuleLoadedOnceGuard } from '../shared/ensureModuleLoadedOnceGuard';
import { UsersCreatedGamesResolver } from './services/resolvers/games/users-created-games-resolver.service';
import { GameInfoResolver } from './services/resolvers/games/edit/game-info-resolver.service';
import { ItemTypesResolver } from './services/resolvers/items/item-types-resolver.service';
import { GameGenresResolver } from './services/resolvers/genres/game-genre.resolver.service';
import { ItemTypeService } from './services/item-type.service';
import { ItemService } from './services/item.service';

export declare let toastr: IToastr;
export declare let jQuery: any;

@NgModule({
    imports: [
        HttpClientModule
        // Can use to override default names for XSRF cookie and header
        // HttpClientXsrfModule.withOptions({
        //   cookieName: 'My-XSRF-TOKEN',
        //   headerName: 'My-X-XSRF-TOKEN',
        // })
    ],
    providers: [
        // Default XSRF provider setup (change cookie or header name if needed): 
        // Can use this with Angular 2+ but if using HttpClientModule use options as shown above
        // { provide: XSRFStrategy, useValue: new CookieXSRFStrategy('XSRF-TOKEN', 'X-XSRF-TOKEN') },
        ConfigService,
        UserService,
        GameService, 
        GenreService,
        RoomService,
        ItemTypeService,
        ItemService,
        AuthGuard,
        NotAlreadyLoggedInGuard,
        CanDeactivateGuard,
        EditGuard,
        DialogService,
        UsersCreatedGamesResolver,
        GameInfoResolver,
        GameRoomsResolver,
        GameRoomResolver,
        ItemTypesResolver,
        GameGenresResolver,
        { provide: TOASTR_TOKEN, useValue: toastr },
        { provide: JQ_TOKEN, useValue: jQuery },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
    ]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
    
    // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        super(parentModule);
    }
       
 }
