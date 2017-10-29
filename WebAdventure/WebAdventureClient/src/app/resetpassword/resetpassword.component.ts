import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { resetpasswordModel } from './resetpasswordModel';

@Component({
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.scss']
  })

export class ResetPasswordComponent implements OnInit{
    model = new resetpasswordModel('','','');

    public myForm = new FormGroup({
        email: new FormControl('', [<any>Validators.required, <any>Validators.maxLength(60), <any>Validators.minLength(5)]),
        password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8), 
                  <any>Validators.maxLength(30)]),
        confirmPassword: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8), 
                  <any>Validators.maxLength(30)])
      });

      constructor(private http: Http, private router: Router){}

    ngOnInit(){}
}