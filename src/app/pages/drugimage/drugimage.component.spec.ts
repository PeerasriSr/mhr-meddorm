import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugimageComponent } from './drugimage.component';

describe('DrugimageComponent', () => {
  let component: DrugimageComponent;
  let fixture: ComponentFixture<DrugimageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugimageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
