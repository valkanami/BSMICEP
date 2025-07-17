import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionFnComponent } from './produccion-fn.component';

describe('ProduccionFnComponent', () => {
  let component: ProduccionFnComponent;
  let fixture: ComponentFixture<ProduccionFnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduccionFnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionFnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
