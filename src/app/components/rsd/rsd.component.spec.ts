import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsdComponent } from './rsd.component';

describe('RsdComponent', () => {
  let component: RsdComponent;
  let fixture: ComponentFixture<RsdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
