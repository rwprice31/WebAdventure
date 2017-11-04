import { UserService } from './../user.service';
import { Injectable, Inject, OnInit } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IToastr } from './../../../shared/interfaces/external-libraries/toastr.interface';

import { TOASTR_TOKEN } from './../external-libraries/toastr.service';

@Injectable()
export class EditGuard implements CanActivate {
    
    private gameId: number;

    fetchIdFromRoute(route: ActivatedRouteSnapshot) {
        this.gameId = +route.params['id'];
        // console.log('This game id = ', this.gameId);
    }

    constructor(private userService: UserService,
        private router: Router,
        @Inject(TOASTR_TOKEN) private toastr: IToastr) {
    
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.fetchIdFromRoute(route);
        // this.toastr.success(this.gameId + '');
        return true;
    }



}
