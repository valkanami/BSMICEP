import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoAguaM3Component } from './consumo-agua-m3.component';

describe('ConsumoAguaM3Component', () => {
  let component: ConsumoAguaM3Component;
  let fixture: ComponentFixture<ConsumoAguaM3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoAguaM3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoAguaM3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
