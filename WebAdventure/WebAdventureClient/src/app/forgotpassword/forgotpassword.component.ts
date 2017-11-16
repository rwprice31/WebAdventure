import { Component, OnInit, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { UserService } from './../core/services/user.service';
import { matchOtherValidator } from "../shared/functions/match-other-validator";
import { IUserForgotPassword } from "../shared/interfaces/user-forgotPassword.interface";
import { IUserForgotPasswordViewModel } from "../shared/interfaces/view-models/IUser-forgotpassword-view-model";
import { IUserForgotPasswordResponse } from "../shared/interfaces/responses/forgot-password-response";
import { IToastr } from './../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from "../core/services/external-libraries/toastr.service";
import { IUserUpdateViewModel } from "../shared/interfaces/view-models/user-update-view-model.interface";
import { IResponse } from "../shared/interfaces/responses/response.interface";

@Component({
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})

export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;

  constructor(private http: Http,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) {

  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required, Validators.maxLength(60)]],
    });
  }

  forgot() {
    let user: IUserForgotPasswordViewModel = {
      email: this.forgotForm.controls['email'].value,
    };

    this.userService.forgotPassword(user).subscribe((res: IResponse) => {
      if (res.status) {
        console.log('Status = true, res = ' + res);
        this.toastr.success('An email with a reset link has been sent to you!');
      } else {
        console.log('Status = false, res = ' + res);
        this.toastr.error('Did not go through!');
      }
    });
  }

}
