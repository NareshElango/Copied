import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantType } from './tenant-type';

describe('TenantType', () => {
  let component: TenantType;
  let fixture: ComponentFixture<TenantType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantType],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
