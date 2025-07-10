import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibraPolComponent } from './fibra-pol.component';

describe('FibraPolComponent', () => {
  let component: FibraPolComponent;
  let fixture: ComponentFixture<FibraPolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FibraPolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FibraPolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
