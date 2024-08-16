import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserToolbarMenuComponent } from './user-toolbar-menu.component';

describe('UserToolbarMenuComponent', () => {
  let component: UserToolbarMenuComponent;
  let fixture: ComponentFixture<UserToolbarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserToolbarMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserToolbarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
