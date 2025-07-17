import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRendimientoCyrComponent } from './tabla-rendimiento-cyr.component';

describe('TablaRendimientoCyrComponent', () => {
  let component: TablaRendimientoCyrComponent;
  let fixture: ComponentFixture<TablaRendimientoCyrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaRendimientoCyrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaRendimientoCyrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
