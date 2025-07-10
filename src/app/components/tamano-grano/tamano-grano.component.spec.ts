import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamanoGranoComponent } from './tamano-grano.component';

describe('TamanoGranoComponent', () => {
  let component: TamanoGranoComponent;
  let fixture: ComponentFixture<TamanoGranoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TamanoGranoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TamanoGranoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
