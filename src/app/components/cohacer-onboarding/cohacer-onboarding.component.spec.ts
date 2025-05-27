import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CohacerOnboardingComponent } from './cohacer-onboarding.component';

describe('CohacerOnboardingComponent', () => {
  let component: CohacerOnboardingComponent;
  let fixture: ComponentFixture<CohacerOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CohacerOnboardingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CohacerOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
