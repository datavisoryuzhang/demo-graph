import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeModule } from '@home/home.module';
import { InitAppModule } from '@init-app/init-app.module';

import { XyzComponent } from '@components/xyz/xyz.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    InitAppModule,
  ],
  declarations: [
    AppComponent,
    XyzComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
