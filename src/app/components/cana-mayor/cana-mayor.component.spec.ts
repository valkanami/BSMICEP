import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanaMayorComponent } from './cana-mayor.component';

describe('CanaMayorComponent', () => {
  let component: CanaMayorComponent;
  let fixture: ComponentFixture<CanaMayorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanaMayorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanaMayorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
