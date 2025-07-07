import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhAguaTorreComponent } from './ph-agua-torre.component';

describe('PhAguaTorreComponent', () => {
  let component: PhAguaTorreComponent;
  let fixture: ComponentFixture<PhAguaTorreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhAguaTorreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhAguaTorreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
