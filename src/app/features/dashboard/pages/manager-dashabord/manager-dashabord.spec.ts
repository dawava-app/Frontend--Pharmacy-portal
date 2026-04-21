import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDashabord } from './manager-dashabord';

describe('ManagerDashabord', () => {
  let component: ManagerDashabord;
  let fixture: ComponentFixture<ManagerDashabord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDashabord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerDashabord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
