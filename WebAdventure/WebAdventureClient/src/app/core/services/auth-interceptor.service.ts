import { UserService } from './user.service';
import { Observable } from 'rxjs/Rx';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const userService = this.injector.get(UserService);

    console.log('User Service = ', userService.getCurrentUser());

    // if there's a current user - add authorization token
    if (userService.getCurrentUser()) {
      let authReq = req.clone( { headers: req.headers.set('Authorization', 'Bearer ' + userService.getCurrentUser().auth_Token)});
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
