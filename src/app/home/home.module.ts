import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { HomeComponent } from './home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    CommonModule,
  ],
  exports: [
    HomeComponent,
  ],
})
export class HomeModule {}
