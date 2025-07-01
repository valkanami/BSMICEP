import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerdidasCosechamientoComponent } from './perdidas-cosechamiento.component';

describe('PerdidasCosechamientoComponent', () => {
  let component: PerdidasCosechamientoComponent;
  let fixture: ComponentFixture<PerdidasCosechamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerdidasCosechamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerdidasCosechamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
