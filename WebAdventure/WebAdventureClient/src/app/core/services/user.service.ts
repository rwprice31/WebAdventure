import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { ConfigService } from './utils/config.service';

import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';

import { IUserRegistration } from './../../shared/interfaces/user-registration.interface';
import { IUser } from './../../shared/interfaces/user.interface';
import { IUserUpdate } from './../../shared/interfaces/user-update.interface';
import { IUserLogin } from './../../shared/interfaces/user-login.interface';

@Injectable()
export class UserService extends BaseService {

    public currentUser: IUser;

    baseUrl = '';
    headers: HttpHeaders;

    registrationRoute = this.baseUrl + 'users/new';
    loginRoute = this.baseUrl + 'users/login';
    logoutRoute = this.baseUrl + 'users/logout';
    resetPasswordRoute = this.baseUrl + 'users/reset';
    updateUserRoute = this.baseUrl + 'users/update';
    
    constructor(private http: HttpClient,
        private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI(); 
        console.log(this.baseUrl);    
        this.headers = configService.getHeaders();   
    }

    register(user: IUserRegistration) {
        console.log('Body entering register = ' + JSON.stringify(user));
        console.log('Sending POST to ' + this.baseUrl + 'users/new');
        let body = JSON.stringify(user);
        return this.http.post('https://localhost:44337/api/users/new', body, { headers: this.headers})
            .subscribe( (res: Response) => {
                console.log('Response from register = ' + res.json());
            });
    }

    updateCurrentUser(user: IUserUpdate) {
        this.currentUser.email = user.email;
        this.currentUser.username = user.username;
        this.http.put(this.updateUserRoute, user, { headers: this.headers })
        .map( (res: Response) => {
            if (res.status === 200 || res.status === 204) {
                return true;
            } else {
                return false;
            }
        })
        .catch(this.handleError);
    }

    loginUser(user: IUserLogin) {
        let body = JSON.stringify(user);
        this.http.post(this.registrationRoute, body, { headers: this.headers })
        .map( (res: Response) => {
            if (res.status === 200) {
                this.currentUser = res.json();
                if (this.currentUser) {
                    return this.currentUser;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        })
        .catch(this.handleError);
    }

    logout() {
        this.currentUser = undefined;
    }

}
