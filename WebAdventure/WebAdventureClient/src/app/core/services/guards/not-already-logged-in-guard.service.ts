import { UserService } from './../user.service';
import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IToastr } from './../../../shared/interfaces/external-libraries/toastr.interface';

import { TOASTR_TOKEN } from './../external-libraries/toastr.service';

@Injectable()
export class NotAlreadyLoggedInGuard implements CanActivate {

  constructor(private userService: UserService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
 
  }

  canActivate() {
      return this.checkAlreadyLoggedIn();
  }

  private checkAlreadyLoggedIn(): boolean {

    if (!this.userService.getCurrentUser()) {
      return true;
    }

    this.router.navigate(['home']);
    this.toastr.warning('You are already logged in.');
    return false;
  }

}
