import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzucarRefundidaComponent } from './azucar-refundida.component';

describe('AzucarRefundidaComponent', () => {
  let component: AzucarRefundidaComponent;
  let fixture: ComponentFixture<AzucarRefundidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AzucarRefundidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AzucarRefundidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
