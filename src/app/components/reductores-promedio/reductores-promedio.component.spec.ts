import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductoresPromedioComponent } from './reductores-promedio.component';

describe('ReductoresPromedioComponent', () => {
  let component: ReductoresPromedioComponent;
  let fixture: ComponentFixture<ReductoresPromedioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductoresPromedioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReductoresPromedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
