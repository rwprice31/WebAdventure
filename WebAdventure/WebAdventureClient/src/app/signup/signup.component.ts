import { IUserRegistrationResponse } from './../shared/interfaces/responses/user-registration-response.interface';

import { IUserRegistrationViewModel } from './../shared/interfaces/view-models/user-registration-view-model.interface';
import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { matchOtherValidator } from './../shared/functions/match-other-validator';

import { UserService } from './../core/services/user.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(private http: Http,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {

  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required, Validators.maxLength(60)]],
      username: ['', [Validators.required, Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required, matchOtherValidator('password')]]
    });
  }

  signup() {
    let user: IUserRegistrationViewModel = {
      email: this.signupForm.controls['email'].value,
      username: this.signupForm.controls['username'].value,
      password: this.signupForm.controls['password'].value
    };
    this.userService.register(user).subscribe( (res: IUserRegistrationResponse) => {
      // successful register
      if (res.status) {
        console.log('Status = true, res = ' + res);
      // something went wrong
      } else {
        console.log('Status = false, res = ' + res);
      }
    });
  }

 }

