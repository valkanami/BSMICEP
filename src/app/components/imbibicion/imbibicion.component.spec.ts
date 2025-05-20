import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImbibicionComponent } from './imbibicion.component';

describe('ImbibicionComponent', () => {
  let component: ImbibicionComponent;
  let fixture: ComponentFixture<ImbibicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImbibicionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImbibicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
