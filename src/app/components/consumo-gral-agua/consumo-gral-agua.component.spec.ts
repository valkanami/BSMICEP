import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoGralAguaComponent } from './consumo-gral-agua.component';

describe('ConsumoGralAguaComponent', () => {
  let component: ConsumoGralAguaComponent;
  let fixture: ComponentFixture<ConsumoGralAguaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoGralAguaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoGralAguaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
