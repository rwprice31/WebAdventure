import { UserService } from './../user.service';
import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IToastr } from './../../../shared/interfaces/external-libraries/toastr.interface';

import { TOASTR_TOKEN } from './../external-libraries/toastr.service';

/**
 * @class AuthGuard
 * @description A guard that let's routes only be activated if a current user is logged in.
 */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userSerivce: UserService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
 
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    // console.log('URL = ' + url);
    return this.checkLogin(url);
  }

  private checkLogin(url: string): boolean {

    if (this.userSerivce.getCurrentUser()) {
      return true;
    }

    this.toastr.info('You must log in to view this content');

    // store the attempted URL for redirecting
    this.userSerivce.setRedirectUrl(url);

    this.router.navigate(['login']);
    return false;
  }

}
