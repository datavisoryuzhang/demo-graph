import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphRoutingModule } from './graph-routing.module';
import { GraphComponent } from './graph.component';
import { DataService } from './services/data.service';

@NgModule({
  imports: [
    CommonModule,
    GraphRoutingModule,
  ],
  declarations: [
    GraphComponent,
  ],
  providers: [
    DataService,
  ],
})
export class GraphModule {}
