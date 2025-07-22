import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosQuimicosComponent } from './productos-quimicos.component';

describe('ProductosQuimicosComponent', () => {
  let component: ProductosQuimicosComponent;
  let fixture: ComponentFixture<ProductosQuimicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosQuimicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosQuimicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
