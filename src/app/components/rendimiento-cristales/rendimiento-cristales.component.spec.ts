import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendimientoCristalesComponent } from './rendimiento-cristales.component';

describe('RendimientoCristalesComponent', () => {
  let component: RendimientoCristalesComponent;
  let fixture: ComponentFixture<RendimientoCristalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendimientoCristalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendimientoCristalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
