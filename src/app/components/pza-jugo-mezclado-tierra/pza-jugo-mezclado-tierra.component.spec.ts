import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PzaJugoMezcladoTierraComponent } from './pza-jugo-mezclado-tierra.component';

describe('PzaJugoMezcladoTierraComponent', () => {
  let component: PzaJugoMezcladoTierraComponent;
  let fixture: ComponentFixture<PzaJugoMezcladoTierraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PzaJugoMezcladoTierraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PzaJugoMezcladoTierraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
