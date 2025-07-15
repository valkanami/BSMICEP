import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCalderasComponent } from './datos-calderas.component';

describe('DatosCalderasComponent', () => {
  let component: DatosCalderasComponent;
  let fixture: ComponentFixture<DatosCalderasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosCalderasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosCalderasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
