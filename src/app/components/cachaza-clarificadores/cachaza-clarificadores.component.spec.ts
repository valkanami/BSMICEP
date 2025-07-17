import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CachazaClarificadoresComponent } from './cachaza-clarificadores.component';

describe('CachazaClarificadoresComponent', () => {
  let component: CachazaClarificadoresComponent;
  let fixture: ComponentFixture<CachazaClarificadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CachazaClarificadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CachazaClarificadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
