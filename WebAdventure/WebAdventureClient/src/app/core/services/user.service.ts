import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { ConfigService } from './utils/config.service';

import { Observable } from 'rxjs/Rx';
import { IResponse } from '../../shared/interfaces/responses/response.interface';
import { IUserRegistrationViewModel } from './../../shared/interfaces/view-models/user-registration-view-model.interface';
import { IUser } from './../../shared/interfaces/models/user.interface';
import { IUserUpdateViewModel } from './../../shared/interfaces/view-models/user-update-view-model.interface';
import { IUserLoginViewModel } from './../../shared/interfaces/view-models/user-login-view-model.interface';

import { IUserRegistrationResponse } from './../../shared/interfaces/responses/user-registration-response.interface';
import { IUserLoginResponse } from './../../shared/interfaces/responses/user-login.response';


import { IUserResetPassword } from "../../shared/interfaces/user-resetPassword.interface";
import { IUserResetPasswordViewModel } from "../../shared/interfaces/view-models/IUser-resetpassword-view-model";
import { IUserResetPasswordResponse } from "../../shared/interfaces/responses/reset-password-response";
import { IUserForgotPasswordResponse } from "../../shared/interfaces/responses/forgot-password-response";
import { IUserForgotPasswordViewModel } from "../../shared/interfaces/view-models/IUser-forgotpassword-view-model";

/**
 * @class UserService
 * @description Encapsulates the logic for API and session storage interactivity involving users
 */

@Injectable()
export class UserService extends BaseService {

    private currentUser: IUser;
    private userSessionStorage = 'user';
    private baseUrl = '';
    private headers: HttpHeaders;
    private redirectUrl: string;

    private registrationRoute: string;
    private loginRoute: string;
    private logoutRoute: string;
    private resetPasswordRoute: string;
    private forgotPasswordRoute: string;
    private updateUserRoute: string;
    
    constructor(private http: HttpClient,
      private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI(); 
        this.registrationRoute = this.baseUrl + 'users/new';
        this.loginRoute = this.baseUrl + 'users/login';
        this.logoutRoute = this.baseUrl + 'users/logout';
        this.forgotPasswordRoute = this.baseUrl + 'users/forgot';
        this.resetPasswordRoute = this.baseUrl + 'users/reset';
        this.updateUserRoute = this.baseUrl + 'users/update';
        this.headers = configService.getHeaders();   
        this.currentUser = this.getCurrentUser();
    }

    /**
     * @name setCurrentUserToSessionStorage
     * @param user - the user you wish to set in session storage
     * @returns void
     * @description Sets the provided user to session storage
     */    
    setCurrentUserToSessionStorage(user: IUser): void {
        console.log('Setting user to local storage = ', JSON.stringify(user));
        sessionStorage.setItem(this.userSessionStorage, JSON.stringify(user));
    }

    /**
     * @name getCurrentUser
     * @returns IUser - the current userly logged in user
     * @description Retrieves the current user from session storage
     */
    getCurrentUser(): IUser {
        let user: IUser = JSON.parse(sessionStorage.getItem(this.userSessionStorage));
        return user;
    }

    /**
     * @name logout
     * @returns void
     * @description Logs a user out by clearing the session storage and setting this.currentUser
     * to null.
     */
    logout(): void {
        // console.log('Logged out!');
        sessionStorage.clear();
        this.currentUser = null;
    }

    /**
     * @name register
     * @param user - IUserRegistrationViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IUserRegistrationResponse.
     * @description Sends a HTTP POST request to the API to register a user.
     */
    register(user: IUserRegistrationViewModel): Observable<IResponse> {
        // console.log('Body entering register = ' + JSON.stringify(user));
        // console.log('Sending POST to ' + this.registrationRoute);
        let body = JSON.stringify(user);
        return this.http.post<IUserRegistrationResponse>(this.registrationRoute, body, { headers: this.headers})
            .map( (res: IUserRegistrationResponse ) => {
                // console.log('IUserRegistrationResponse = ', res);
                return res;
            })
            .catch(this.handleError);
    }

    /**
     * @name loginUser
     * @param user - IUserLoginViewModel - the view model used for the API request
     * @returns Observable<IResponse> - an observable that the caller needs to subscribe. A caller should treat 
     * a successful response as the type IUserLoginResponse.
     * @description Sends a HTTP POST request to the API to log a user in
     */
    loginUser(user: IUserLoginViewModel): Observable<IResponse> {
        // console.log('Body entering loginUser = ' + JSON.stringify(user));
        // console.log('Sending POST to ' + this.loginRoute);
        let body = JSON.stringify(user);
        return this.http.post<IUserLoginResponse>(this.loginRoute, body, { headers: this.headers })
        .map( (res: IUserLoginResponse) => {
            // console.log('IUserLoginResponse = ', res);
            if (res.status) {
                // console.log('Setting current user equal to ', res.user);
              this.setCurrentUserToSessionStorage(res.user);
          }
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

    resetPassword(user: IUserResetPasswordViewModel): Observable<IResponse> {
      console.log('Reset password = ' + JSON.stringify(user));
      console.log('Sending POST to ' + this.baseUrl + 'users/reset');
      let body = JSON.stringify(user);
      return this.http.post<IUserResetPasswordResponse>(this.resetPasswordRoute, user, { headers: this.headers })
        .map((res: IUserResetPasswordResponse) => {
          if (res.status) {
            console.log('IUserResetPasswordResponse = ', res);
            return res;
          }
         
        })
        .catch(this.handleError);
    }

    forgotPassword(user: IUserForgotPasswordViewModel): Observable<IResponse> {

      console.log('Forgot password = ' + JSON.stringify(user));
      console.log('Sending POST to ' + this.baseUrl + 'users/forgot');
      let body = JSON.stringify(user);
      return this.http.post<IUserForgotPasswordResponse>(this.forgotPasswordRoute, user, { headers: this.headers })
        .map((res: IUserForgotPasswordResponse) => {
          if (res.status) {
            console.log('IUserResetPasswordResponse = ', res);
            return res;
          }

        })
        .catch(this.handleError);
    }

 
    setRedirectUrl(url: string) {
        this.redirectUrl = url;
    }

    getRedirectUrl(): string {
        let url = this.redirectUrl;
        return url;

    }

}
