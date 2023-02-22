import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, Observable } from 'rxjs';
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { AuthService } from './auth.service';
import * as AuthActions from './auth.actions';
import { User } from '../models/user.model';

const handleAuth = (res:any) => {
    const expirationDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
    const user = new User(res.email, res.localId, res.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({email: res.email, userId: res.localId, token: res.idToken, expirationDate: expirationDate, redirect: true},);
}
const handleError = (err: any) => {
    let errorMessage = 'An unknown error occurred';
    if(!err.error || !err.error.error) return of(new AuthActions.AuthenticateFail(errorMessage));
    switch(err.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = "This email address already exists";
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = "This email doesn't exist";
        break;
      case 'INVALID_PASSWORD':
        errorMessage = "This password is not correct";

    }
    return of(new AuthActions.AuthenticateFail(errorMessage));

}

@Injectable()
export class AuthEffects {
    private loginUrl= 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAsU0_I2Yb3TMsRYWJHqgKl6HLE3R7td50';
    private signUpUrl= 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAsU0_I2Yb3TMsRYWJHqgKl6HLE3R7td50';

    authSignup$ = createEffect((): Observable<any> =>{
        return this.actions$.pipe(ofType(AuthActions.SIGNUP_START), switchMap((signupAction: AuthActions.SignupStart)=>{
            return this.http.post(this.signUpUrl, {email: signupAction.payload.email, password: signupAction.payload.password, returnSecureToken: true}).pipe(tap((res:any)=>this.authService.setLogoutTimer(+res.expiresIn * 1000)),map(res =>  handleAuth(res)), 
            catchError(err => handleError(err)))
        }))
    })
    authLogin$ =  createEffect((): Observable<any> => {
        return this.actions$.pipe(ofType(AuthActions.LOGIN_START), switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<any>(this.loginUrl, {email: authData.payload.email, password: authData.payload.password, returnSecureToken: true}).pipe(tap((res:any)=>this.authService.setLogoutTimer(+res.expiresIn * 1000)),map(res =>  handleAuth(res)), 
        catchError(err => handleError(err))) 
    }))
});

autoLogin$ =  createEffect((): Observable<any> => {
    return this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), map(() => {
    const userData = localStorage.getItem('userData');
    if(userData) {
    const user = JSON.parse(userData);
    const loadedUser = new User(user.email, user.id, user._token, new Date(user._tokenExpirationDate));
    if(loadedUser.token){
        const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({email:loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(user._tokenExpirationDate), redirect: false});
    }
    }
    return {type: 'DUMMY'};
    }))
});

authRedirect$ = createEffect((): Observable<any> => {
    return this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap((authSuccessAction: AuthActions.AuthenticateSuccess) =>{
        if(authSuccessAction.payload.redirect) this.router.navigate(['/recipes']);
    }))
},{dispatch: false});

authLogout$ = createEffect((): Observable<any> => {
    return this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() =>{
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/login']);
    }))
},{dispatch: false});

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}
}

