import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer';
import { map } from 'rxjs/operators';
import * as RecipesActions from '../../store/recipes.actions'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id!: number;
  editMode: boolean= false;
  recipeForm!: FormGroup;
  private sub!: Subscription;
  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] ? true : false;
      //this.editMode = params['id'] != null;
      this.initForm();
    });
  }
  onSubmit(){
    if(this.editMode){
      this.store.dispatch(new RecipesActions.UpdateRecipe({index: this.id, recipe: this.recipeForm.value}));
    }else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  getControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
  onAddIngredient(){
    (this.recipeForm.get('ingredients') as FormArray).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }))
  }
  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  onClick(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }
  private initForm(): void { 
    let recipeName ='';
    let recipeImagePath ='';
    let recipeDescription = '';
    let recipeIngredients: any= new FormArray([]);
    if(this.editMode){
      this.sub = this.store.select('recipes').pipe(map(state => state.recipes.find((recipe, index) => index === this.id))).subscribe(recipe => {
      if(recipe){
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if(recipe['ingredients']) {
        for(let ingredient of recipe.ingredients){
          recipeIngredients.push(new FormGroup({
            'name': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount,[Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          })
          );
        }
      }
    }
      });
      
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }
  ngOnDestroy(): void {
    if(this.sub)  this.sub.unsubscribe();
  }
}
