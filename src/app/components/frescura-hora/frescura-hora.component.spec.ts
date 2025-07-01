import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrescuraHoraComponent } from './frescura-hora.component';

describe('FrescuraHoraComponent', () => {
  let component: FrescuraHoraComponent;
  let fixture: ComponentFixture<FrescuraHoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrescuraHoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrescuraHoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
