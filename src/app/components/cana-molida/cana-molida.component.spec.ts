import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanaMolidaComponent } from './cana-molida.component';

describe('CanaMolidaComponent', () => {
  let component: CanaMolidaComponent;
  let fixture: ComponentFixture<CanaMolidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanaMolidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanaMolidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
