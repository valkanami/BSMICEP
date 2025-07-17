import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RellenoTorreComponent } from './relleno-torre.component';

describe('RellenoTorreComponent', () => {
  let component: RellenoTorreComponent;
  let fixture: ComponentFixture<RellenoTorreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RellenoTorreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RellenoTorreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
