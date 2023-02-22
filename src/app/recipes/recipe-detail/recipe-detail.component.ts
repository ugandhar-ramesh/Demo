import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer'
import { map, switchMap } from 'rxjs/operators';
import * as RecipesActions from '../../store/recipes.actions';
import * as ShoppingListActions from '../../store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  id!: number;
  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) {
    // const id = +this.route.snapshot.params['id'];
   }

  ngOnInit(): void {
    this.route.params.pipe(map(params => +params['id']), switchMap(id => {
      this.id = id;
      return this.store.select('recipes');
    }), map(state => state.recipes.find((recipe: Recipe, index: number) => index === this.id))).subscribe(recipe => {
     if(recipe) this.recipe = recipe;
    });
  }
  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }
  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route})
  }
  onDeleteRecipe(){
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
