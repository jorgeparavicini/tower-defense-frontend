import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureShopComponent } from './structure-shop.component';

describe('StructureShopComponent', () => {
  let component: StructureShopComponent;
  let fixture: ComponentFixture<StructureShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructureShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
