import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { loginModel } from './loginModel';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  model = new loginModel('','');
  error : string = "Please enter valid credentials";
  loginForm: FormGroup;
  public submitted: boolean;
  public events: any[] = [];
  private apiUrl = 'https://localhost:44337/api/users/login'
  data: any ={};

  constructor(private http: Http, 
    private router: Router,
    private formBuilder: FormBuilder) {
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

  login(model, isValid: boolean) {
    this.submitted = true;
    if (isValid) {
      this.loginUser();
    }
  }

  loginUser() {

    var obj = {
      "email" : this.loginForm.controls['email'].value,
      "password" : this.loginForm.controls['password'].value
    };

    console.log(obj);

    // return this.http.post(this.apiUrl, obj).map((res: Response) =>
    // {
    //   if (res.status == 200) {
    //     this.router.navigate(['']);
    //   }
    // }).subscribe(
    //   suc => {
    //   },
    //   err => {
    //     if (err.status == 401) {
    //       this.loginForm.reset();
    //       this.error = "Invalid Email";
    //     }
    //     else if (err.status == 400) {
    //       this.loginForm.reset();
    //       this.error = "Invalid Email/Password";
    //     }
    //     else {
    //       this.loginForm.reset();
    //       this.error = "There was an error";
    //     }
    //   }
    //);
  }
}