import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BannerDirective } from '../directives/banner.directive';
import { AlertComponent } from '../shared/alert/alert.component';
import * as fromApp from '../app.reducer';
import * as AuthActions from './auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error = '';
  private sub!: Subscription;
  @ViewChild(BannerDirective, {static: true}) alertHost!:BannerDirective;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.store.select('auth').subscribe(state => {
      this.isLoading = state.loading;
      this.error = state.authError;
      if(this.error) this.showErrorAlert(this.error);
    })
  }
  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm){
    if(!form.valid) return;
    const email = form.value.email;
    const password = form.value.password;
    if(this.isLoginMode){
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    }else{
      this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
    }
    form.reset();
  }

  onAlert(){
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(message: string){
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(AlertComponent);
    componentRef.instance.message = message;
   this.sub = componentRef.instance.close.subscribe(() => {
    this.sub.unsubscribe();
    hostViewContainerRef.clear();
    });
  }
  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe();
  }
}
