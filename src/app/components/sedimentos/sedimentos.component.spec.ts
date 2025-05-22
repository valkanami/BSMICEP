import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedimentosComponent } from './sedimentos.component';

describe('SedimentosComponent', () => {
  let component: SedimentosComponent;
  let fixture: ComponentFixture<SedimentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SedimentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
