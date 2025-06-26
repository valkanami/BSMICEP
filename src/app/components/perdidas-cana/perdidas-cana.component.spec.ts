import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerdidasCanaComponent } from './perdidas-cana.component';

describe('PerdidasCanaComponent', () => {
  let component: PerdidasCanaComponent;
  let fixture: ComponentFixture<PerdidasCanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerdidasCanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerdidasCanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
