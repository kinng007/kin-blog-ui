import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoogleAuthUser, LoginService } from './login/login.service';
import { filter, tap } from 'rxjs/operators';

@Injectable()
export class GoogleAuthInterceptor implements HttpInterceptor {
  private googleAuthUser: GoogleAuthUser;

  constructor(private loginService: LoginService) {
    this.loginService.user$
      .pipe(
        filter((u) => !!u),
        tap((u) => (this.googleAuthUser = u))
      )
      .subscribe();
  }

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!!this.googleAuthUser) {
      return next.handle(
        httpRequest.clone({
          setHeaders: { Authorization: 'gauth=' + this.googleAuthUser.token },
        })
      );
    }
    return next.handle(httpRequest);
  }
}
