import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluadoraRevisionComponent } from './evaluadora-revision.component';

describe('EvaluadoraRevisionComponent', () => {
  let component: EvaluadoraRevisionComponent;
  let fixture: ComponentFixture<EvaluadoraRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluadoraRevisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluadoraRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
