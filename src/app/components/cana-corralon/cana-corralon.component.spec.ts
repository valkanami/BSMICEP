import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanaCorralonComponent } from './cana-corralon.component';

describe('CanaCorralonComponent', () => {
  let component: CanaCorralonComponent;
  let fixture: ComponentFixture<CanaCorralonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanaCorralonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanaCorralonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
