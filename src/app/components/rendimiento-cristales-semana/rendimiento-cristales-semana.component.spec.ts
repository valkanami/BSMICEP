import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendimientoCristalesSemanaComponent } from './rendimiento-cristales-semana.component';

describe('RendimientoCristalesSemanaComponent', () => {
  let component: RendimientoCristalesSemanaComponent;
  let fixture: ComponentFixture<RendimientoCristalesSemanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendimientoCristalesSemanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendimientoCristalesSemanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
