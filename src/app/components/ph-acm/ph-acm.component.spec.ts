import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhAcmComponent } from './ph-acm.component';

describe('PhAcmComponent', () => {
  let component: PhAcmComponent;
  let fixture: ComponentFixture<PhAcmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhAcmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhAcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
