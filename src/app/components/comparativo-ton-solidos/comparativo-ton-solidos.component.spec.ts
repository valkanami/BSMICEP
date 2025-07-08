import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoTonSolidosComponent } from './comparativo-ton-solidos.component';

describe('ComparativoTonSolidosComponent', () => {
  let component: ComparativoTonSolidosComponent;
  let fixture: ComponentFixture<ComparativoTonSolidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparativoTonSolidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparativoTonSolidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
