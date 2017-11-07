import { Component, OnInit, Inject} from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { UserService } from './../core/services/user.service';
import { resetpasswordModel } from './resetpasswordModel';
import { matchOtherValidator } from "../shared/functions/match-other-validator";
import { IUserResetPassword } from "../shared/interfaces/user-resetPassword.interface";
import { IUserResetPasswordViewModel } from "../shared/interfaces/view-models/IUser-resetpassword-view-model";
import { IUserResetPasswordResponse } from "../shared/interfaces/responses/reset-password-response";
import { IToastr } from './../shared/interfaces/external-libraries/toastr.interface';
import { TOASTR_TOKEN } from "../core/services/external-libraries/toastr.service";

@Component({
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.scss']
  })

export class ResetPasswordComponent implements OnInit{

    resetForm: FormGroup;

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
        this.resetForm = this.formBuilder.group({
          email: ['', [Validators.email, Validators.required, Validators.maxLength(60)]],
          password: ['', Validators.required, Validators.minLength(8)],
          confirmPassword: ['', [Validators.required, matchOtherValidator('password')]]
        });
      }

      reset() {
        let user: IUserResetPasswordViewModel = {
          email: this.resetForm.controls['email'].value,
          password: this.resetForm.controls['password'].value
        };
        this.userService.resetPassword(user).subscribe((res: IUserResetPasswordResponse) => {
          if (res.status) {
            console.log('Status = true, res = ' + res);
            this.toastr.success('Password Reset Successfull!');
          } else {
            console.log('Status = false, res = ' + res);
            this.toastr.error('Password Reset Failed!');
          }
        });
      }
}
