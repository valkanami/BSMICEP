import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonCanaImbibicionComponent } from './ton-cana-imbibicion.component';

describe('TonCanaImbibicionComponent', () => {
  let component: TonCanaImbibicionComponent;
  let fixture: ComponentFixture<TonCanaImbibicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TonCanaImbibicionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TonCanaImbibicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
