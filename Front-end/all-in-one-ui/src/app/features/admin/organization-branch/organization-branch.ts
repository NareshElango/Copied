import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-organization-branch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './organization-branch.html',
  styleUrls: ['./organization-branch.css'],
})
export class OrganizationBranchComponent implements OnInit {
  branchForm!: FormGroup;

  organizations: any[] = [];

  divisions: any[] = [];

  branches: any[] = [];

  filteredBranches: any[] = [];

  searchText: string = '';
  originalBranchData: any = null;
  // =========================
  // DROPDOWN
  // =========================
  isOrgDropdownOpen = false;

  isDivisionDropdownOpen = false;

  selectedOrgName = '';

  selectedDivisionName = '';

  // =========================
  // EDIT
  // =========================
  isEditMode = false;

  editId: number | null = null;

  // =========================
  // API
  // =========================
  private api = 'http://localhost:5019/api/OrganizationBranch';

  private orgApi = 'http://localhost:5019/api/Organization';

  private divisionApi = 'http://localhost:5019/api/Division';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  // =========================
  // SWEET ALERT
  // =========================
  showAlert(icon: 'success' | 'error' | 'warning', title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#2563eb',
      timer: 2500,
      showConfirmButton: false,
    });
  }

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    console.log('Organization Branch Component Loaded');

    this.branchForm = this.fb.group({
      branchName: ['', [
   Validators.required,
   Validators.pattern(/^[A-Za-z ]+$/)
 ]],

      organizationId: [null, Validators.required],

      divisionId: [null, Validators.required],

      address: ['', Validators.required],

      phone: ['', [
    Validators.required,
    Validators.pattern(/^[0-9]{10}$/)
  ]],
    });

    // LOAD MASTER DATA FIRST
    this.loadOrganizations();
  }

  // =========================
  // LOAD ORGANIZATIONS
  // =========================
  loadOrganizations(): void {
    console.log('Loading Organizations...');

    this.http.get<any[]>(this.orgApi).subscribe({
      next: (res) => {
        console.log('Organizations Loaded:', res);

        this.organizations = res || [];

        // LOAD DIVISIONS AFTER ORGANIZATIONS
        this.loadDivisions();
      },

      error: (err) => {
        console.error('Organization load error', err);

        this.showAlert('error', 'Error', 'Failed to load organizations');
      },
    });
  }

  // =========================
  // LOAD DIVISIONS
  // =========================
  loadDivisions(): void {
    console.log('Loading Divisions...');

    this.http.get<any[]>(this.divisionApi).subscribe({
      next: (res) => {
        console.log('Divisions Loaded:', res);

        this.divisions = res || [];

        // LOAD BRANCHES AFTER DIVISIONS
        this.loadBranches();
      },

      error: (err) => {
        console.error('Division load error', err);

        this.showAlert('error', 'Error', 'Failed to load divisions');
      },
    });
  }

  // =========================
  // LOAD BRANCHES
  // =========================
  loadBranches(): void {
    console.log('Loading Branches...');

    this.http.get<any[]>(this.api).subscribe({
      next: (res) => {
        console.log('Branches Loaded:', res);

        this.branches = res || [];

        this.filteredBranches = [...this.branches];

        this.applySearch();

        // FORCE UI REFRESH
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Branch load error', err);

        this.showAlert('error', 'Error', 'Failed to load branches');
      },
    });
  }

  // =========================
  // TOGGLE ORG DROPDOWN
  // =========================
  toggleOrgDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.isOrgDropdownOpen = !this.isOrgDropdownOpen;

    this.isDivisionDropdownOpen = false;
  }

  // =========================
  // TOGGLE DIVISION DROPDOWN
  // =========================
  toggleDivisionDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.isDivisionDropdownOpen = !this.isDivisionDropdownOpen;

    this.isOrgDropdownOpen = false;
  }

  // =========================
  // SELECT ORGANIZATION
  // =========================
  selectOrganization(o: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.selectedOrgName = o.organizationName;

    this.branchForm.patchValue({
      organizationId: o.organizationId,
    });

    this.isOrgDropdownOpen = false;
  }

  // =========================
  // SELECT DIVISION
  // =========================
  selectDivision(d: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.selectedDivisionName = d.divisionName;

    this.branchForm.patchValue({
      divisionId: d.divisionId,
    });

    this.isDivisionDropdownOpen = false;
  }

  // =========================
  // CLOSE DROPDOWN
  // =========================
  @HostListener('document:click', ['$event'])
  closeDropdown(event: any): void {
    if (!event.target.closest('.custom-select-wrapper')) {
      this.isOrgDropdownOpen = false;

      this.isDivisionDropdownOpen = false;
    }
  }

  // =========================
  // SAVE / UPDATE
  // =========================
  onSubmit(): void {

  // =========================
  // REQUIRED FIELD VALIDATION
  // =========================

  if(
    !this.branchForm.value.branchName &&
    !this.branchForm.value.organizationId &&
    !this.branchForm.value.divisionId &&
    !this.branchForm.value.address &&
    !this.branchForm.value.phone
  ){
    this.showAlert(
      'warning',
      'Validation Error',
      'Please fill all the required fields'
    );
    return;
  }


  if(!this.branchForm.value.branchName){
    this.showAlert(
      'warning',
      'Validation Error',
      'Branch Name is required'
    );
    return;
  }


  if(!this.branchForm.value.organizationId){
    this.showAlert(
      'warning',
      'Validation Error',
      'Organization is required'
    );
    return;
  }


  if(!this.branchForm.value.divisionId){
    this.showAlert(
      'warning',
      'Validation Error',
      'Division is required'
    );
    return;
  }


  if(!this.branchForm.value.address){
    this.showAlert(
      'warning',
      'Validation Error',
      'Address is required'
    );
    return;
  }


  if(!this.branchForm.value.phone){
    this.showAlert(
      'warning',
      'Validation Error',
      'Phone is required'
    );
    return;
  }


  // =========================
  // REGEX VALIDATION
  // =========================

  this.branchForm.markAllAsTouched();


  if(this.branchForm.get('branchName')?.hasError('pattern')){
    this.showAlert(
      'warning',
      'Validation Error',
      'Branch Name should contain only letters'
    );
    return;
  }


  if(this.branchForm.get('phone')?.hasError('pattern')){
    this.showAlert(
      'warning',
      'Validation Error',
      'Phone number must contain exactly 10 digits'
    );
    return;
  }


  const payload = this.branchForm.value;


  // =========================
  // UPDATE
  // =========================
  if (this.isEditMode && this.editId !== null) {


    if (!this.isFormChanged()) {

      this.showAlert(
        'warning',
        'No Changes',
        'No changes detected to update'
      );

      return;
    }


    this.http.put(`${this.api}/${this.editId}`, payload)
    .subscribe({

      next: () => {

        this.showAlert(
          'success',
          'Updated',
          'Branch updated successfully!'
        );

        this.loadBranches();

        this.resetForm();
      },


      error: (err) => {

        console.error('Update error', err);

        this.showAlert(
          'error',
          'Error',
          err?.error || 'Update failed'
        );
      }

    });

  }


  // =========================
  // CREATE
  // =========================
  else {


    this.http.post(this.api, payload)
    .subscribe({

      next: () => {

        this.showAlert(
          'success',
          'Saved',
          'Branch saved successfully!'
        );


        this.loadBranches();

        this.resetForm();

      },


      error: (err) => {

        console.error('Create error', err);


        this.showAlert(
          'error',
          'Error',
          err?.error || 'Create failed'
        );

      }

    });

  }

}

  isFormChanged(): boolean {

  const current = this.branchForm.value;

  return (
    current.branchName !== this.originalBranchData.branchName ||
    Number(current.organizationId) !== Number(this.originalBranchData.organizationId) ||
    Number(current.divisionId) !== Number(this.originalBranchData.divisionId) ||
    current.address !== this.originalBranchData.address ||
    current.phone !== this.originalBranchData.phone
  );

}

  // =========================
  // EDIT
  // =========================
  editBranch(b: any): void {
    this.isEditMode = true;

    this.editId = b.branchId;
     this.originalBranchData = {
    branchName: b.branchName,
    organizationId: b.organizationId,
    divisionId: b.divisionId,
    address: b.address,
    phone: b.phone
  };

    this.branchForm.patchValue({
      branchName: b.branchName,

      organizationId: b.organizationId,

      divisionId: b.divisionId,

      address: b.address,

      phone: b.phone,
    });

    this.selectedOrgName = b.organizationName || '';

    this.selectedDivisionName = b.divisionName || '';
  }

  // =========================
  // DELETE
  // =========================
  deleteBranch(id: number): void {
    Swal.fire({
      title: 'Delete Branch?',
      text: 'Are you sure you want to delete this branch?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.api}/${id}`).subscribe({
          next: () => {
            this.showAlert('success', 'Deleted', 'Branch deleted successfully!');

            this.loadBranches();
          },

          error: (err) => {
            console.error('Delete error', err);

            this.showAlert('error', 'Error', err?.error || 'Delete failed');
          },
        });
      }
    });
  }

  // =========================
  // RESET
  // =========================
  resetForm(): void {
    this.branchForm.reset();

    this.selectedOrgName = '';

    this.selectedDivisionName = '';

    this.isEditMode = false;

    this.editId = null;

    this.isOrgDropdownOpen = false;

    this.isDivisionDropdownOpen = false;
  }

  // =========================
  // SEARCH
  // =========================
  applySearch(): void {
    const term = this.searchText.toLowerCase();

    this.filteredBranches = this.branches.filter(
      (b) =>
        (b.branchName || '').toLowerCase().includes(term) ||
        (b.organizationName || '').toLowerCase().includes(term) ||
        (b.divisionName || '').toLowerCase().includes(term),
    );
  }

  // =========================
  // VALIDATION
  // =========================
  hasError(control: string): boolean {
    const field = this.branchForm.get(control);

    return !!(field && field.invalid && field.touched);
  }

  allowOnlyLetters(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', ' '];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
    }
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
