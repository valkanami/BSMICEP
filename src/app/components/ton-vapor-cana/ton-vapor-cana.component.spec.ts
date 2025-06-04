import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonVaporCanaComponent } from './ton-vapor-cana.component';

describe('TonVaporCanaComponent', () => {
  let component: TonVaporCanaComponent;
  let fixture: ComponentFixture<TonVaporCanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TonVaporCanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TonVaporCanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
