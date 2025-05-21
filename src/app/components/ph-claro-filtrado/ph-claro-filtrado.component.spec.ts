import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhClaroFiltradoComponent } from './ph-claro-filtrado.component';

describe('PhClaroFiltradoComponent', () => {
  let component: PhClaroFiltradoComponent;
  let fixture: ComponentFixture<PhClaroFiltradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhClaroFiltradoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhClaroFiltradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
