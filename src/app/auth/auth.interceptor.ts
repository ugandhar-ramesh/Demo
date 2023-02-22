import { Store } from '@ngrx/store';
import { map, exhaustMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as fromApp from '../app.reducer';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: Store<fromApp.AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return this.store.select('auth').pipe(take(1), map(state => state.user), exhaustMap((user: any)=> {
      if (!user) return next.handle(request);
      const modifiedRequest = request.clone({
        params: new HttpParams().set('auth', user.token)
      })
      return next.handle(modifiedRequest);
    }));
  }
}
