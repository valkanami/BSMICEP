import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhTratadoComponent } from './ph-tratado.component';

describe('PhTratadoComponent', () => {
  let component: PhTratadoComponent;
  let fixture: ComponentFixture<PhTratadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhTratadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhTratadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
