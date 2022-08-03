import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InitAppComponent } from './init-app.component';

describe('InitAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        InitAppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(InitAppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'demo-graph'`, () => {
    const fixture = TestBed.createComponent(InitAppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('demo-graph');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(InitAppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('demo-graph app is running!');
  });
});
