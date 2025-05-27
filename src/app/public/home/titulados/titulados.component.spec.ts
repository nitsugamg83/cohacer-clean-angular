import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TituladosComponent } from './titulados.component';

describe('TituladosComponent', () => {
  let component: TituladosComponent;
  let fixture: ComponentFixture<TituladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TituladosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TituladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
