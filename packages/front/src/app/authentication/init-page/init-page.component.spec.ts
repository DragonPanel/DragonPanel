import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitPageComponent } from './init-page.component';

describe('InitPageComponent', () => {
  let component: InitPageComponent;
  let fixture: ComponentFixture<InitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
