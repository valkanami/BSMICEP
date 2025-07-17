import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendimientoTurnoComponent } from './rendimiento-turno.component';

describe('RendimientoTurnoComponent', () => {
  let component: RendimientoTurnoComponent;
  let fixture: ComponentFixture<RendimientoTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendimientoTurnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendimientoTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
