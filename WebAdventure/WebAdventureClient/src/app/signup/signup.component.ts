import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { signupModel } from './signupModel';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  model = new signupModel('','','','');
  error : string = "Please eneter valid credentials";
  public submitted: boolean;
  private apiUrl = 'https://localhost:44337/api/users/new';
  data: any ={};
  passwordError: string = "Password must contain a number";
  confirmPasswordError: string = "Password must contain a number";
  
  public myForm = new FormGroup({
    email: new FormControl('', [<any>Validators.required, <any>Validators.maxLength(60), <any>Validators.minLength(5)]),
    username: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(40)]),
    password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8), 
              <any>Validators.maxLength(30)]),
    confirmPassword: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8), 
              <any>Validators.maxLength(30)])
  });

  constructor(private http: Http, private router: Router){}

  ngOnInit(){}

  register(model, isValid: boolean) {
    this.submitted = true;
    if (model.password != model.confirmPassword) {
      isValid = false;
      this.error = "Passwords must match";
    }
    if (isValid) {
      this.registerUser(model);
    }
  }

  registerUser(model) {
    var obj = { 
      "email" : model.email,
      "username" : model.username,
      "password" : model.password
    };

    return this.http.post(this.apiUrl, obj).map((res: Response) =>
  {
    if (res.status == 200) {
      this.router.navigate(['']);
    }
  }).subscribe(
    suc => {
    },
    err => {
      if (err.status == 400) {
        this.myForm.reset();
        this.error = "Username already exists. Please try again";
      }
      else if (err.status == 401) {
        this.myForm.reset();
        this.error = "Email is already in use. Please try again";
      }
      else if (err.status = 404) {
        this.myForm.reset();
        this.error = "There was an error";
      }
    }
  )
  }
 }
