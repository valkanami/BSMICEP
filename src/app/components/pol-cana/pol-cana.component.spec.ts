import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolCanaComponent } from './pol-cana.component';

describe('PolCanaComponent', () => {
  let component: PolCanaComponent;
  let fixture: ComponentFixture<PolCanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolCanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolCanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
