import { UserService } from './user.service';
import { Observable } from 'rxjs/Rx';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

/**
 * @class AuthInterceptor
 * @description An http interceptor that intercepts every HTTP request going out of the angular 
 * app.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private injector: Injector) { }

  /**
  * @name intercept
  * @param req, next
  * @returns Observable<HttpEvent<any>>
  * @description Intercepts each HTTP request and sets a Bearer authorization token
  */ 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const userService = this.injector.get(UserService);

    // console.log('User Service = ', userService.getCurrentUser());

    // if there's a current user - add authorization token
    if (userService.getCurrentUser()) {
      let authReq = req.clone( { headers: req.headers.set('Authorization', 'Bearer ' + userService.getCurrentUser().auth_Token)});
      // console.log('Setting auth header = ' + userService.getCurrentUser().auth_Token);
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
