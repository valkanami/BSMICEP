import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnasCarbonComponent } from './columnas-carbon.component';

describe('ColumnasCarbonComponent', () => {
  let component: ColumnasCarbonComponent;
  let fixture: ComponentFixture<ColumnasCarbonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnasCarbonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnasCarbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
