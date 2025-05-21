import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhDesmenuzadoMezcladoComponent } from './ph-desmenuzado-mezclado.component';

describe('PhDesmenuzadoMezcladoComponent', () => {
  let component: PhDesmenuzadoMezcladoComponent;
  let fixture: ComponentFixture<PhDesmenuzadoMezcladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhDesmenuzadoMezcladoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhDesmenuzadoMezcladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
