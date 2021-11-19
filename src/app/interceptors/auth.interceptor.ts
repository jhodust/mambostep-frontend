import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, tap} from 'rxjs/operators';
/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _authService:AuthService,
    private _router:Router){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {



    return next.handle(req).pipe(
      catchError(e => {
        if(e.status == 401){
          if(this._authService.isAuthenticated()){
            this._authService.logout();
          }
          this._router.navigate(['/login']);
        }
        return throwError(e);
      })
    );
  }
}


