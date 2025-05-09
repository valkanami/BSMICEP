import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurbidezJugoClaroComponent } from './turbidez-jugo-claro.component';

describe('TurbidezJugoClaroComponent', () => {
  let component: TurbidezJugoClaroComponent;
  let fixture: ComponentFixture<TurbidezJugoClaroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurbidezJugoClaroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurbidezJugoClaroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
