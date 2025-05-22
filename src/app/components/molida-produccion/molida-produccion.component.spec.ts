import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MolidaProduccionComponent } from './molida-produccion.component';

describe('MolidaProduccionComponent', () => {
  let component: MolidaProduccionComponent;
  let fixture: ComponentFixture<MolidaProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MolidaProduccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MolidaProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
