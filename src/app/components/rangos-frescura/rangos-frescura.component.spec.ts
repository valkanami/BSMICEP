import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangosFrescuraComponent } from './rangos-frescura.component';

describe('RangosFrescuraComponent', () => {
  let component: RangosFrescuraComponent;
  let fixture: ComponentFixture<RangosFrescuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangosFrescuraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangosFrescuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
