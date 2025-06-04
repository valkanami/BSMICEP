import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurbidezAzucarComponent } from './turbidez-azucar.component';

describe('TurbidezAzucarComponent', () => {
  let component: TurbidezAzucarComponent;
  let fixture: ComponentFixture<TurbidezAzucarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurbidezAzucarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurbidezAzucarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
