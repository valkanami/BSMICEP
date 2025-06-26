import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DextranasBrixComponent } from './dextranas-brix.component';

describe('DextranasBrixComponent', () => {
  let component: DextranasBrixComponent;
  let fixture: ComponentFixture<DextranasBrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DextranasBrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DextranasBrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
