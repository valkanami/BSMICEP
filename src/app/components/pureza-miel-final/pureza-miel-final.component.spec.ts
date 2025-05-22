import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurezaMielFinalComponent } from './pureza-miel-final.component';

describe('PurezaMielFinalComponent', () => {
  let component: PurezaMielFinalComponent;
  let fixture: ComponentFixture<PurezaMielFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurezaMielFinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurezaMielFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
