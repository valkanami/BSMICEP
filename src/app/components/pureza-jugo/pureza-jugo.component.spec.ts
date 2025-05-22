import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurezaJugoComponent } from './pureza-jugo.component';

describe('PurezaJugoComponent', () => {
  let component: PurezaJugoComponent;
  let fixture: ComponentFixture<PurezaJugoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurezaJugoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurezaJugoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
