import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiProcesoComponent } from './mi-proceso.component';

describe('MiProcesoComponent', () => {
  let component: MiProcesoComponent;
  let fixture: ComponentFixture<MiProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiProcesoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
