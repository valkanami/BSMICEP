import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoAblComponent } from './comparativo-abl.component';

describe('ComparativoAblComponent', () => {
  let component: ComparativoAblComponent;
  let fixture: ComponentFixture<ComparativoAblComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparativoAblComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparativoAblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
