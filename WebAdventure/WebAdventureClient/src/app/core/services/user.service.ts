import { IUserLoginResponse } from './../../shared/interfaces/responses/user-login.response';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { ConfigService } from './utils/config.service';

import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';

import { IResponse } from '../../shared/interfaces/responses/response.interface';
import { IUserRegistrationViewModel } from './../../shared/interfaces/view-models/user-registration-view-model.interface';
import { IUser } from './../../shared/interfaces/models/user.interface';
import { IUserUpdateViewModel } from './../../shared/interfaces/view-models/user-update-view-model.interface';
import { IUserLoginViewModel } from './../../shared/interfaces/view-models/user-login-view-model.interface';

import { IUserRegistrationResponse } from './../../shared/interfaces/responses/user-registration-response.interface';

@Injectable()
export class UserService extends BaseService {

    public currentUser: IUser;

    baseUrl = '';
    headers: HttpHeaders;

    registrationRoute: string;
    loginRoute: string;
    logoutRoute: string;
    resetPasswordRoute: string;
    updateUserRoute: string;
    
    constructor(private http: HttpClient,
        private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI(); 
        this.registrationRoute = this.baseUrl + 'users/new';
        this.loginRoute = this.baseUrl + 'users/login';
        this.logoutRoute = this.baseUrl + 'users/logout';
        this.resetPasswordRoute = this.baseUrl + 'users/reset';
        this.updateUserRoute = this.baseUrl + 'users/update';
        this.headers = configService.getHeaders();   
    }

    register(user: IUserRegistrationViewModel): Observable<IResponse> {
        console.log('Body entering register = ' + JSON.stringify(user));
        console.log('Sending POST to ' + this.registrationRoute);
        let body = JSON.stringify(user);
        return this.http.post<IUserRegistrationResponse>(this.registrationRoute, body, { headers: this.headers})
            .map( (res: IUserRegistrationResponse ) => {
                console.log('IUserRegistrationResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

    loginUser(user: IUserLoginViewModel): Observable<IResponse> {
        console.log('Body entering loginUser = ' + JSON.stringify(user));
        console.log('Sending POST to ' + this.loginRoute);
        let body = JSON.stringify(user);
        return this.http.post<IUserLoginResponse>(this.loginRoute, body, { headers: this.headers })
        .map( (res: IUserLoginResponse) => {
            console.log('IUserLoginResponse = ', res);
            return res;
        })
        .catch(this.handleError);
    }

    updateCurrentUser(user: IUserUpdateViewModel) {
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

    logout() {
        this.currentUser = undefined;
    }

}
