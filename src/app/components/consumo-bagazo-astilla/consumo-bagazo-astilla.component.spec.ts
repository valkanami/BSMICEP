import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoBagazoAstillaComponent } from './consumo-bagazo-astilla.component';

describe('ConsumoBagazoAstillaComponent', () => {
  let component: ConsumoBagazoAstillaComponent;
  let fixture: ComponentFixture<ConsumoBagazoAstillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoBagazoAstillaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoBagazoAstillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
