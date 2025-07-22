import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondensadosImpurosComponent } from './condensados-impuros.component';

describe('CondensadosImpurosComponent', () => {
  let component: CondensadosImpurosComponent;
  let fixture: ComponentFixture<CondensadosImpurosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CondensadosImpurosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CondensadosImpurosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
