import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormShipmentComponent } from './form-shipment.component';

describe('FormShipmentComponent', () => {
  let component: FormShipmentComponent;
  let fixture: ComponentFixture<FormShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormShipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
