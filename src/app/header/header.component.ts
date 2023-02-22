import { Store } from '@ngrx/store';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as AuthActions from '../auth/auth.actions';
import * as RecipeActions from '../store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy  {
  isLoggedIn: boolean = false;
  private sub!: Subscription;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.sub = this.store.select('auth').subscribe(state => {
      this.isLoggedIn = !!state.user;
    });
  }

  onSave(){
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetch(){

    this.store.dispatch(new RecipeActions.GetRecipes());
  }

  onLogout(){
    this.store.dispatch(new AuthActions.Logout())
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
