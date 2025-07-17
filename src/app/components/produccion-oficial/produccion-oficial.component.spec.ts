import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionOficialComponent } from './produccion-oficial.component';

describe('ProduccionOficialComponent', () => {
  let component: ProduccionOficialComponent;
  let fixture: ComponentFixture<ProduccionOficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduccionOficialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionOficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
