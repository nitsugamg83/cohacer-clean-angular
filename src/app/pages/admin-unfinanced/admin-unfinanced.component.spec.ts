import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUnfinancedComponent } from './admin-unfinanced.component';

describe('AdminUnfinancedComponent', () => {
  let component: AdminUnfinancedComponent;
  let fixture: ComponentFixture<AdminUnfinancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUnfinancedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUnfinancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
