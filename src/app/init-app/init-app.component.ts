import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-init',
  templateUrl: './init-app.component.html',
  styleUrls: ['./init-app.component.scss']
})
export class InitAppComponent implements OnInit {
  title = 'demo-graph';

  ngOnInit() {
    console.log('Lifecycle methods should not be empty  @angular-eslint/no-empty-lifecycle-method');
  }
}
