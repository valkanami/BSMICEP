import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoMedidorComponent } from './consumo-medidor.component';

describe('ConsumoMedidorComponent', () => {
  let component: ConsumoMedidorComponent;
  let fixture: ComponentFixture<ConsumoMedidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoMedidorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoMedidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
