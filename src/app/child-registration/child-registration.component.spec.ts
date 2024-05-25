import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildRegistrationComponent } from './child-registration.component';

describe('ChildRegistrationComponent', () => {
  let component: ChildRegistrationComponent;
  let fixture: ComponentFixture<ChildRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
