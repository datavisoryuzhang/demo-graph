import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@home/home.component';
import { InitAppComponent } from '@init-app/init-app.component';
import { XyzComponent } from '@components/xyz/xyz.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'init-app',
    component: InitAppComponent,
  },
  {
    path: 'xyz',
    component: XyzComponent,
  },
  {
    path: 'graph',
    /**
     * Please check https://angular.io/guide/lazy-loading-ngmodules
     **/
    loadChildren: () => import('@graph/graph.module').then(m => m.GraphModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
