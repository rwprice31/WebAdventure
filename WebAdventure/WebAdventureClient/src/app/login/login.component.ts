import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { loginModel } from './loginModel';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model = new loginModel('','');
  ngOnInit(){
  }

  private apiUrl = 'https://localhost:44337/api/users'
  data: any ={};

  constructor(private http: Http) {
    console.log('Hello');
    this.getData();
    this.getUserCount();
  }

  getData() {
    return this.http.get(this.apiUrl).map((res: Response) => res.json)
  }

  getUserCount() {
    this.getData().subscribe(data => {
      console.log(data);
      this.data = data
    })
  }

  get currentLogin() { return JSON.stringify(this.model); }
 }
