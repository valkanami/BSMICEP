import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductoresClaroMeladuraComponent } from './reductores-claro-meladura.component';

describe('ReductoresClaroMeladuraComponent', () => {
  let component: ReductoresClaroMeladuraComponent;
  let fixture: ComponentFixture<ReductoresClaroMeladuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductoresClaroMeladuraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReductoresClaroMeladuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
