import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashbaird } from './admin-dashbaird';

describe('AdminDashbaird', () => {
  let component: AdminDashbaird;
  let fixture: ComponentFixture<AdminDashbaird>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashbaird]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashbaird);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
