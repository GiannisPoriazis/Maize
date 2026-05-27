import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { take, exhaustMap, catchError, tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { NotificationPhrases, NotificationType } from '../refData/ref-data';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private spinnerTimeout: any;

  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const self = this;
    clearTimeout(this.spinnerTimeout);
    this.spinnerTimeout = setTimeout(function() { self.notificationService.setLoader(true) }, 300);

    return this.authenticationService.getCurrentUser().pipe(
      take(1),
      exhaustMap(user => {
        if (user && user.token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
        }

        return next.handle(req).pipe(
          tap({
            complete: () => {
              clearTimeout(this.spinnerTimeout);
              this.notificationService.setLoader(false);
            }
          }),
          catchError((event: HttpErrorResponse) => {
            clearTimeout(this.spinnerTimeout);
            this.notificationService.setLoader(false);

            if (event.status === 500) {
              this.notificationService.renderTemplate(NotificationType.Error, event.error + ' Please refresh the page and start over.');
            }
            else if (event.status === 401) {
              this.authenticationService.logout(NotificationPhrases.LogoutSessionExpired); 
            }
            else if (event.status === 400) {
              this.authenticationService.logout();
            }

            return throwError(event);
          })
        );
      })
    );
  }
}
