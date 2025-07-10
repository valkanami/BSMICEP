import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonPolPerdidasComponent } from './ton-pol-perdidas.component';

describe('TonPolPerdidasComponent', () => {
  let component: TonPolPerdidasComponent;
  let fixture: ComponentFixture<TonPolPerdidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TonPolPerdidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TonPolPerdidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
