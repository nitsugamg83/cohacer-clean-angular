import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmadoFisicoComponent } from './armado-fisico.component';

describe('ArmadoFisicoComponent', () => {
  let component: ArmadoFisicoComponent;
  let fixture: ComponentFixture<ArmadoFisicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmadoFisicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmadoFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
