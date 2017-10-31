import { UserService } from './../user.service';
import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IToastr } from './../../../shared/interfaces/external-libraries/toastr.interface';

import { TOASTR_TOKEN } from './../external-libraries/toastr.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userSerivce: UserService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
 
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    console.log('URL = ' + url);
    return this.checkLogin(url);
  }

  private checkLogin(url: string): boolean {

    if (this.userSerivce.getCurrentUser()) {
      return true;
    }

    // store the attempted URL for redirecting
    this.userSerivce.setRedirectUrl(url);

    this.router.navigate(['login']);
    return false;
  }

}
