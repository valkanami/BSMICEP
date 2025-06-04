import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimaDiaComponent } from './clima-dia.component';

describe('ClimaDiaComponent', () => {
  let component: ClimaDiaComponent;
  let fixture: ComponentFixture<ClimaDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClimaDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClimaDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
