import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Dir } from '@angular/cdk/bidi';
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
  public myForm = new FormGroup({
      email: new FormControl('', [<any>Validators.required]),
      password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8)])
    });
  public submitted: boolean;
  public events: any[] = [];
  private apiUrl = 'https://localhost:44337/api/users/login'
  data: any ={};

  constructor(private http: Http, private router: Router) {
  }

  ngOnInit(){
  }

  login(model, isValid: boolean) {
    this.submitted = true;
    if (isValid) {
      this.loginUser(model.email, model.password);
    }
  }

  loginUser(email, password) {

    var obj = {
      "email" : email,
      "password" : password
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
        if (err.status == 401) {
          this.myForm.reset();
          this.error = "Invalid Email";
        }
        else if (err.status == 400) {
          this.myForm.reset();
          this.error = "Invalid Email/Password";
        }
        else {
          this.myForm.reset();
          this.error = "There was an error";
        }
      }
    );
  }
}