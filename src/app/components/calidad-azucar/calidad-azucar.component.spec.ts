import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalidadAzucarComponent } from './calidad-azucar.component';

describe('CalidadAzucarComponent', () => {
  let component: CalidadAzucarComponent;
  let fixture: ComponentFixture<CalidadAzucarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalidadAzucarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalidadAzucarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
