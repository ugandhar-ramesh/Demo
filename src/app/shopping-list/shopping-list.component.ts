import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Ingredient } from './../models/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromApp from '../app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
ingredients!: Observable<{ ingredients: Ingredient[] }>;
  constructor(private store: Store<fromApp.AppState>) {
   }

  ngOnInit(): void {
   this.ingredients = this.store.select("shoppingList");

  }


  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
