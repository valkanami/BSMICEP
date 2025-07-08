import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaGralAguaComponent } from './descarga-gral-agua.component';

describe('DescargaGralAguaComponent', () => {
  let component: DescargaGralAguaComponent;
  let fixture: ComponentFixture<DescargaGralAguaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescargaGralAguaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescargaGralAguaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
