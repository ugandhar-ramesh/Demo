import { map, Subscription } from 'rxjs';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import  * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes! : Recipe[];
  sub: Subscription;
  constructor(private router: Router,private route: ActivatedRoute, private store: Store<fromApp.AppState>) {
    this.sub = this.store.select('recipes').pipe(map(state => state.recipes)).subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
   }

  ngOnInit(): void {
   
  }
  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
