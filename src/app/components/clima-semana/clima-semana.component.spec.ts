import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimaSemanaComponent } from './clima-semana.component';

describe('ClimaSemanaComponent', () => {
  let component: ClimaSemanaComponent;
  let fixture: ComponentFixture<ClimaSemanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClimaSemanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClimaSemanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
