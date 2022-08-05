import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-xyz',
  templateUrl: './xyz.component.html',
  styleUrls: ['./xyz.component.scss']
})
export class XyzComponent implements OnInit {
  variable = 'abc';

  constructor() { }

  ngOnInit() {
    console.log('Lifecycle methods should not be empty  @angular-eslint/no-empty-lifecycle-method');
  }
}
