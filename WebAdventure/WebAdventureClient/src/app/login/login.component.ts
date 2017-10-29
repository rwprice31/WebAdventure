import { IUserLoginResponse } from './../shared/interfaces/responses/user-login.response';
import { UserService } from './../core/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { IUserLoginViewModel } from './../shared/interfaces/view-models/user-login-view-model.interface';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService) {
  }

  ngOnInit() {
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
        } else {
          console.log('Login failed = ', res);
        }
      }
    );
  }

 
}
