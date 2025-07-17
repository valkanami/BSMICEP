import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCanaAccidentalComponent } from './reporte-cana-accidental.component';

describe('ReporteCanaAccidentalComponent', () => {
  let component: ReporteCanaAccidentalComponent;
  let fixture: ComponentFixture<ReporteCanaAccidentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCanaAccidentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCanaAccidentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
