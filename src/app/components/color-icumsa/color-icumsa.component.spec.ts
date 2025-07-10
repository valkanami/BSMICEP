import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorIcumsaComponent } from './color-icumsa.component';

describe('ColorIcumsaComponent', () => {
  let component: ColorIcumsaComponent;
  let fixture: ComponentFixture<ColorIcumsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorIcumsaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorIcumsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
