import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhPromedioComponent } from './ph-promedio.component';

describe('PhPromedioComponent', () => {
  let component: PhPromedioComponent;
  let fixture: ComponentFixture<PhPromedioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhPromedioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhPromedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
