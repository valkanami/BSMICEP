import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrixMeladuraComponent } from './brix-meladura.component';

describe('BrixMeladuraComponent', () => {
  let component: BrixMeladuraComponent;
  let fixture: ComponentFixture<BrixMeladuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrixMeladuraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrixMeladuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
