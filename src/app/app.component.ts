import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './app.reducer';
import * as AuthActions from './auth/auth.actions';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent implements OnInit {
    title = 'DemoApp';
    constructor(private store: Store<fromApp.AppState>){}
    ngOnInit(): void {
      this.store.dispatch(new AuthActions.AutoLogin());
    }
  }
