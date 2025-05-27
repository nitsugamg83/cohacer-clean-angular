import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenciaturasComponent } from './licenciaturas.component';

describe('LicenciaturasComponent', () => {
  let component: LicenciaturasComponent;
  let fixture: ComponentFixture<LicenciaturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenciaturasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenciaturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
