import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, switchMap, map, withLatestFrom } from "rxjs";
import { Recipe } from '../models/recipe.model';
import * as RecipesActions from './recipes.actions';
import * as fromApp from '../app.reducer';

@Injectable()
export class RecipeEffects {
    private apiUrl = 'https://fir-app-be3f4-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json';

    fetchRecipes$ = createEffect((): Observable<any> =>{
        return this.actions$.pipe(ofType(RecipesActions.GET_RECIPES), switchMap(() =>{
            return this.http.get<Recipe[]>(this.apiUrl)
        }), map(recipes =>{
            return recipes.map(recipe =>{
              return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
            })
          }), map(recipes => new RecipesActions.SetRecipes(recipes)))
    })

    storeRecipes$ = createEffect((): Observable<any> =>{
        return this.actions$.pipe(ofType(RecipesActions.STORE_RECIPES), withLatestFrom(this.store.select('recipes')),switchMap(([actionData, recipesState]) =>{
            return this.http.put(this.apiUrl, recipesState.recipes);
        }))
    }, {dispatch: false})
    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>){}
}