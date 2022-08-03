import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { InitAppComponent } from './init-app.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    InitAppComponent,
  ],
  declarations: [
    InitAppComponent,
  ],
  providers: [],
})
export class InitAppModule { }
