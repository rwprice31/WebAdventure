import { AuthInterceptor } from './services/auth-interceptor.service';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { GameService } from './services/game.service';
import { GenreService } from './services/genre.service';
import { UserService } from './services/user.service';
import { ConfigService } from './services/utils/config.service';
import { DialogService } from './services/dialog.service';
import { CanDeactivateGuard } from './services/guards/can-deactivate-guard.service';

import { AuthGuard } from './services/guards/auth-guard.service';
import { NotAlreadyLoggedInGuard } from './services/guards/not-already-logged-in-guard.service';

import { TOASTR_TOKEN } from './services/external-libraries/toastr.service';
import { JQ_TOKEN } from './services/external-libraries/jQuery.service';

import { IToastr } from '../shared/interfaces/external-libraries/toastr.interface';

import { EnsureModuleLoadedOnceGuard } from '../shared/ensureModuleLoadedOnceGuard';

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
        AuthGuard,
        NotAlreadyLoggedInGuard,
        CanDeactivateGuard,
        DialogService,
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
