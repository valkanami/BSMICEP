import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilosComponent } from './silos.component';

describe('SilosComponent', () => {
  let component: SilosComponent;
  let fixture: ComponentFixture<SilosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SilosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SilosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
