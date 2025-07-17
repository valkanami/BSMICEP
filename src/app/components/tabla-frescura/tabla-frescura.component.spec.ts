import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFrescuraComponent } from './tabla-frescura.component';

describe('TablaFrescuraComponent', () => {
  let component: TablaFrescuraComponent;
  let fixture: ComponentFixture<TablaFrescuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaFrescuraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaFrescuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
