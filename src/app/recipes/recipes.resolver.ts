import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { Recipe } from '../models/recipe.model';
import * as fromApp from '../app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import { Store } from '@ngrx/store';
import { Actions, ofType} from '@ngrx/effects';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolver implements Resolve<Recipe[]> {
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    return this.store.select('recipes').pipe(take(1), map(state => state.recipes), switchMap(recipes => {
      if(recipes.length === 0) {
        this.store.dispatch(new RecipesActions.GetRecipes());
        return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
      } else {
        return of(recipes);
      }
    }))
  }
}
