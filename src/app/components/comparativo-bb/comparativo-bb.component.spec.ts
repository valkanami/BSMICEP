import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoBbComponent } from './comparativo-bb.component';

describe('ComparativoBbComponent', () => {
  let component: ComparativoBbComponent;
  let fixture: ComponentFixture<ComparativoBbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparativoBbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparativoBbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
