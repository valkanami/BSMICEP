import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrescuraRsdComponent } from './frescura-rsd.component';

describe('FrescuraRsdComponent', () => {
  let component: FrescuraRsdComponent;
  let fixture: ComponentFixture<FrescuraRsdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrescuraRsdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrescuraRsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
