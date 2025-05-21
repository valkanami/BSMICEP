import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductoresComponent } from './reductores.component';

describe('ReductoresComponent', () => {
  let component: ReductoresComponent;
  let fixture: ComponentFixture<ReductoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReductoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
