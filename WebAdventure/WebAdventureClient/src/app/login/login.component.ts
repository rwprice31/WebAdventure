import { IUserLoginResponse } from './../shared/interfaces/responses/user-login.response';
import { UserService } from './../core/services/user.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { IToastr } from './../shared/interfaces/external-libraries/toastr.interface';
import { IUserLoginViewModel } from './../shared/interfaces/view-models/user-login-view-model.interface';

import { TOASTR_TOKEN } from './../core/services/external-libraries/toastr.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr) {
  }

  ngOnInit() {
    console.log('Current user = ' + this.userService.getCurrentUser());
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    let userLogin: IUserLoginViewModel = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    };
    this.userService.loginUser(userLogin).subscribe(
      (res: IUserLoginResponse) => {
        if (res.status) {
          console.log('Login success = ', res);
          this.toastr.success('Successfully logged in!');
          if (!!this.userService.getRedirectUrl()) {
            this.router.navigate([this.userService.getRedirectUrl()]);
            this.userService.setRedirectUrl(null);
          } else {
            this.router.navigate(['home']);
          }
        } else {
          console.log('Login failed = ', res);
          this.loginForm.controls['password'].reset();
          this.toastr.error(res.statusText);
        }
      }
    );
  }

 
}
