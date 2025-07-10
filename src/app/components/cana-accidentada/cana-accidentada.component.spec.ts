import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanaAccidentadaComponent } from './cana-accidentada.component';

describe('CanaAccidentadaComponent', () => {
  let component: CanaAccidentadaComponent;
  let fixture: ComponentFixture<CanaAccidentadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanaAccidentadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanaAccidentadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
