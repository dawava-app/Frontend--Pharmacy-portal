import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuffDashbaord } from './stuff-dashbaord';

describe('StuffDashbaord', () => {
  let component: StuffDashbaord;
  let fixture: ComponentFixture<StuffDashbaord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StuffDashbaord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StuffDashbaord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
