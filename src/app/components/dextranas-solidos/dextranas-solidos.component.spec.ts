import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DextranasSolidosComponent } from './dextranas-solidos.component';

describe('DextranasSolidosComponent', () => {
  let component: DextranasSolidosComponent;
  let fixture: ComponentFixture<DextranasSolidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DextranasSolidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DextranasSolidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
