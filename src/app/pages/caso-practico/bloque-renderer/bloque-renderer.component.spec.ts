import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloqueRendererComponent } from './bloque-renderer.component';

describe('BloqueRendererComponent', () => {
  let component: BloqueRendererComponent;
  let fixture: ComponentFixture<BloqueRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloqueRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloqueRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
