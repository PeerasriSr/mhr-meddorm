import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenddataComponent } from './senddata.component';

describe('SenddataComponent', () => {
  let component: SenddataComponent;
  let fixture: ComponentFixture<SenddataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenddataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
