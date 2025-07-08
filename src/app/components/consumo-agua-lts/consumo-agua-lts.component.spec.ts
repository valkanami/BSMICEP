import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoAguaLtsComponent } from './consumo-agua-lts.component';

describe('ConsumoAguaLtsComponent', () => {
  let component: ConsumoAguaLtsComponent;
  let fixture: ComponentFixture<ConsumoAguaLtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoAguaLtsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoAguaLtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
