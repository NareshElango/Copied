import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationBranch } from './organization-branch';

describe('OrganizationBranch', () => {
  let component: OrganizationBranch;
  let fixture: ComponentFixture<OrganizationBranch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationBranch],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationBranch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
