import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolDescargaFabricaComponent } from './pol-descarga-fabrica.component';

describe('PolDescargaFabricaComponent', () => {
  let component: PolDescargaFabricaComponent;
  let fixture: ComponentFixture<PolDescargaFabricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolDescargaFabricaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolDescargaFabricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
