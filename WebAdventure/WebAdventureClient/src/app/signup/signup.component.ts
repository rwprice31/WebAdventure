import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { signupModel } from './signupModel';

import { matchOtherValidator } from './../shared/functions/match-other-validator';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  model = new signupModel('', '', '', '');
  error = 'Please eneter valid credentials';
  public submitted: boolean;
  private apiUrl = 'https://localhost:44337/api/users/new';
  data: any = { };
  passwordError = 'Password must contain a number';
  confirmPasswordError = 'Password must contain a number';

  signupForm: FormGroup;

  private password = 'password';
  private passwordConfirmation = 'password';

  public myForm = new FormGroup({
    email: new FormControl('', [<any>Validators.required, <any>Validators.maxLength(60), <any>Validators.minLength(5)]),
    username: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(40)]),
    password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8), 
              <any>Validators.maxLength(30)]),
    confirmPassword: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8), 
              <any>Validators.maxLength(30)])
  });

  constructor(private http: Http,
    private router: Router,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required, Validators.maxLength(60)]],
      username: ['', [Validators.required, Validators.maxLength(40)]],
      password: ['', Validators.required],
      passwordConfirmation: ['', [Validators.required, matchOtherValidator('password')]]
    });
  }

  register(model, isValid: boolean) {
    this.submitted = true;
    if (model.password !== model.confirmPassword) {
      isValid = false;
      this.error = 'Passwords must match';
    }
    if (isValid) {
      this.registerUser(model);
    }
  }

  registerUser(model) {

    const obj = {
      'email' : model.email,
      'username' : model.username,
      'password' : model.password
    };

    return this.http.post(this.apiUrl, obj).map((res: Response) => {
      if (res.status === 200) {
        this.router.navigate(['']);
      }
    }).subscribe(
      suc => {
      },
      err => {
        if (err.status === 400) {
          this.myForm.reset();
          this.error = 'Username already exists. Please try again';
        } else if (err.status === 401) {
          this.myForm.reset();
          this.error = 'Email is already in use. Please try again';
        } else if (err.status === 404) {
          this.myForm.reset();
          this.error = 'There was an error';
        }
      }
    );
  }

 }

