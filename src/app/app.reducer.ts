
import { ActionReducerMap } from '@ngrx/store';

import * as fromShoppingList from './store/shopping-list.reducer';
import * as fromAuth from './auth/auth.reducer';
import * as fromRecipes from './store/recipes.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as AuthActions from './auth/auth.actions';
import * as RecipesActions from './store/recipes.actions';


export interface AppState {
    shoppingList: fromShoppingList.State;
    auth: fromAuth.State;
    recipes: fromRecipes.State;
}

type AppActions = {
    type: string;
    shoppingList: ShoppingListActions.ShoppingListActions;
    auth: AuthActions.AuthActions;
    recipes: RecipesActions.RecipesActions;
}

export const appReducer: ActionReducerMap<AppState, any> = {
shoppingList: fromShoppingList.shoppingListReducer,
auth: fromAuth.authReducer,
recipes: fromRecipes.recipeReducer
}