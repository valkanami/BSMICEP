import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorFcrComponent } from './color-fcr.component';

describe('ColorFcrComponent', () => {
  let component: ColorFcrComponent;
  let fixture: ComponentFixture<ColorFcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorFcrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorFcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
