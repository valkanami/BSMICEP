import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MolidaRendimientoComponent } from './molida-rendimiento.component';

describe('MolidaRendimientoComponent', () => {
  let component: MolidaRendimientoComponent;
  let fixture: ComponentFixture<MolidaRendimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MolidaRendimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MolidaRendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
