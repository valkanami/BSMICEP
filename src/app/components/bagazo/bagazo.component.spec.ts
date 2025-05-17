import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagazoComponent } from './bagazo.component';

describe('BagazoComponent', () => {
  let component: BagazoComponent;
  let fixture: ComponentFixture<BagazoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagazoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
