import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RezasurinaComponent } from './rezasurina.component';

describe('RezasurinaComponent', () => {
  let component: RezasurinaComponent;
  let fixture: ComponentFixture<RezasurinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RezasurinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RezasurinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
