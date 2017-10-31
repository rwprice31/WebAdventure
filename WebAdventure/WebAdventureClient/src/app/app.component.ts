import { Router } from '@angular/router';
import { IUser } from './shared/interfaces/models/user.interface';
import { UserService } from './core/services/user.service';
import { Component, Inject } from '@angular/core';

import { IToastr } from './shared/interfaces/external-libraries/toastr.interface';

import { TOASTR_TOKEN } from './core/services/external-libraries/toastr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 

  constructor(private userService: UserService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
    
  }

  logout() {
    this.userService.logout();
    this.toastr.success('Successfully logged out!');
    this.router.navigate(['home']);
  }

}
