import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TribuComponent } from './tribu.component';

describe('TribuComponent', () => {
  let component: TribuComponent;
  let fixture: ComponentFixture<TribuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TribuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TribuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
