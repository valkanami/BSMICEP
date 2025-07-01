import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCosechaComponent } from './reporte-cosecha.component';

describe('ReporteCosechaComponent', () => {
  let component: ReporteCosechaComponent;
  let fixture: ComponentFixture<ReporteCosechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCosechaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCosechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
