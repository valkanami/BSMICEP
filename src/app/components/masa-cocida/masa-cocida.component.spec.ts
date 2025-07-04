import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasaCocidaComponent } from './masa-cocida.component';

describe('MasaCocidaComponent', () => {
  let component: MasaCocidaComponent;
  let fixture: ComponentFixture<MasaCocidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasaCocidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasaCocidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
