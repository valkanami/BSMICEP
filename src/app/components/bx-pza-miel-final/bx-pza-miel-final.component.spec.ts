import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BxPzaMielFinalComponent } from './bx-pza-miel-final.component';

describe('BxPzaMielFinalComponent', () => {
  let component: BxPzaMielFinalComponent;
  let fixture: ComponentFixture<BxPzaMielFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BxPzaMielFinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BxPzaMielFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
