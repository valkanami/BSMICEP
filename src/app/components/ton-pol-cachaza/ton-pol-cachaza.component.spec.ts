import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonPolCachazaComponent } from './ton-pol-cachaza.component';

describe('TonPolCachazaComponent', () => {
  let component: TonPolCachazaComponent;
  let fixture: ComponentFixture<TonPolCachazaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TonPolCachazaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TonPolCachazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
