import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EficienciaFabricaComponent } from './eficiencia-fabrica.component';

describe('EficienciaFabricaComponent', () => {
  let component: EficienciaFabricaComponent;
  let fixture: ComponentFixture<EficienciaFabricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EficienciaFabricaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EficienciaFabricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
