import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoliendaComponent } from './molienda.component';

describe('MoliendaComponent', () => {
  let component: MoliendaComponent;
  let fixture: ComponentFixture<MoliendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoliendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoliendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
