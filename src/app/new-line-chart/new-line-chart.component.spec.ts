import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLineChartComponent } from './new-line-chart.component';

describe('NewLineChartComponent', () => {
  let component: NewLineChartComponent;
  let fixture: ComponentFixture<NewLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLineChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
