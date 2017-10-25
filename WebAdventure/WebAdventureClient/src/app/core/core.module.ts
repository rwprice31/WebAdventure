import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { GenreService } from './genre.service';
import { GameInfoService } from './game-info.service';
import { TOASTR_TOKEN } from './external-libraries/toastr.service';
import { IToastr } from '../shared/interfaces/toastr.interface';
import { JQ_TOKEN } from './external-libraries/jQuery.service';

import { EnsureModuleLoadedOnceGuard } from '../shared/ensureModuleLoadedOnceGuard';

export declare let toastr : IToastr;
export declare let jQuery : any;

@NgModule({
    imports: [
        HttpClientModule
        //Can use to override default names for XSRF cookie and header
        // HttpClientXsrfModule.withOptions({
        //   cookieName: 'My-XSRF-TOKEN',
        //   headerName: 'My-X-XSRF-TOKEN',
        // })
    ],
    providers: [
        //Default XSRF provider setup (change cookie or header name if needed): 
        //Can use this with Angular 2+ but if using HttpClientModule use options as shown above
        //{ provide: XSRFStrategy, useValue: new CookieXSRFStrategy('XSRF-TOKEN', 'X-XSRF-TOKEN') },
        GameInfoService, 
        GenreService,
        { provide: TOASTR_TOKEN, useValue: toastr },
        { provide: JQ_TOKEN, useValue: jQuery }
    ]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
    
    //Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        super(parentModule);
    }
       
 }
