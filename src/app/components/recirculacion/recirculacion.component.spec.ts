import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecirculacionComponent } from './recirculacion.component';

describe('RecirculacionComponent', () => {
  let component: RecirculacionComponent;
  let fixture: ComponentFixture<RecirculacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecirculacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecirculacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
