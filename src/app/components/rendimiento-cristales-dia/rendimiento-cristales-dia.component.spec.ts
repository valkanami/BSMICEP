import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendimientoCristalesDiaComponent } from './rendimiento-cristales-dia.component';

describe('RendimientoCristalesDiaComponent', () => {
  let component: RendimientoCristalesDiaComponent;
  let fixture: ComponentFixture<RendimientoCristalesDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendimientoCristalesDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendimientoCristalesDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
