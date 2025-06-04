import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhFcrComponent } from './ph-fcr.component';

describe('PhFcrComponent', () => {
  let component: PhFcrComponent;
  let fixture: ComponentFixture<PhFcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhFcrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhFcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
