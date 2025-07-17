import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCanaComponent } from './datos-cana.component';

describe('DatosCanaComponent', () => {
  let component: DatosCanaComponent;
  let fixture: ComponentFixture<DatosCanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosCanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosCanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
