import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhDescargaFabricaComponent } from './ph-descarga-fabrica.component';

describe('PhDescargaFabricaComponent', () => {
  let component: PhDescargaFabricaComponent;
  let fixture: ComponentFixture<PhDescargaFabricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhDescargaFabricaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhDescargaFabricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
