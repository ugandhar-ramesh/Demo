import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './../directives/dropdown.directive';
import { BannerDirective } from './../directives/banner.directive';
import { AlertComponent } from './alert/alert.component';




@NgModule({
  declarations: [
    AlertComponent,
    BannerDirective,
    DropdownDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[
    AlertComponent,
    BannerDirective,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule { }
