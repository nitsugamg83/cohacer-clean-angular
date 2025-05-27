import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertosComponent } from './expertos.component';

describe('ExpertosComponent', () => {
  let component: ExpertosComponent;
  let fixture: ComponentFixture<ExpertosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
