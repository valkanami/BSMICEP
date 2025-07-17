import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalderasDatosDiaComponent } from './calderas-datos-dia.component';

describe('CalderasDatosDiaComponent', () => {
  let component: CalderasDatosDiaComponent;
  let fixture: ComponentFixture<CalderasDatosDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalderasDatosDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalderasDatosDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
