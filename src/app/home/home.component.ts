import { Component } from '@angular/core';

@Component({
  template: `
    <h1>Welcome! This is app home page.</h1>
    <ul>
      <li>
        <a routerLink="/init-app">init app</a>
      </li>
      <li>
        <a routerLink="/xyz">xyz</a>
      </li>
      <li>
        <a routerLink="/graph">graph</a>
      </li>
    </ul>
  `,
})
export class HomeComponent {}
