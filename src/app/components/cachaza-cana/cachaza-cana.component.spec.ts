import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CachazaCanaComponent } from './cachaza-cana.component';

describe('CachazaCanaComponent', () => {
  let component: CachazaCanaComponent;
  let fixture: ComponentFixture<CachazaCanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CachazaCanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CachazaCanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
