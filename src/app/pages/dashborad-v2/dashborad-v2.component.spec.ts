import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradV2Component } from './dashborad-v2.component';

describe('DashboradV2Component', () => {
  let component: DashboradV2Component;
  let fixture: ComponentFixture<DashboradV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboradV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboradV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
