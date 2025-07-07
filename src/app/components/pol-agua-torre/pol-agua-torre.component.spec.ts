import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolAguaTorreComponent } from './pol-agua-torre.component';

describe('PolAguaTorreComponent', () => {
  let component: PolAguaTorreComponent;
  let fixture: ComponentFixture<PolAguaTorreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolAguaTorreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolAguaTorreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
