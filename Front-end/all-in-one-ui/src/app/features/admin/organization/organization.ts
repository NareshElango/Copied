import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './organization.html',
  styleUrls: ['./organization.css'],
})
export class Organization implements OnInit {
  orgForm!: FormGroup;

  tenantTypes: any[] = [];
  districts: any[] = [];
  countries: any[] = [];
  states: any[] = [];

  organizations: any[] = [];
  filteredOrganizations: any[] = [];
  originalOrganizationData: any = null;
  searchText = '';

  isEditMode = false;
  editingId: number | null = null;

  private api = 'http://localhost:5019/api/Organization';
  private tenantApi = 'http://localhost:5019/api/TenantType';
  private districtApi = 'http://localhost:5019/api/District';
  private countryApi = 'http://localhost:5019/api/Country';
  private stateApi = 'http://localhost:5019/api/State';

  isTenantDropdownOpen = false;
  isDistrictDropdownOpen = false;
  isCountryDropdownOpen = false;
  isStateDropdownOpen = false;

  selectedTenantName = '';
  selectedDistrictName = '';
  selectedCountryName = '';
  selectedStateName = '';

  showTenantError = false;
  showDistrictError = false;
  showCountryError = false;
  showStateError = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  showAlert(icon: any, title: string, text: string) {
    Swal.fire({
      icon,
      title,
      text,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  ngOnInit(): void {
    this.orgForm = this.fb.group({
      organizationCode: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      organizationName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      tenantTypeId: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      stateId: [null, [Validators.required]],
      districtId: [null, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });

    this.loadTenantTypes();
    this.loadCountries();
    this.loadOrganizations();
  }

  // ================= COUNTRY =================
  loadCountries() {
    this.http.get<any[]>(this.countryApi).subscribe((res) => {
      this.countries = res || [];
    });
  }

  // ================= STATE =================
  loadStates(countryId: number) {
    this.http.get<any[]>(`${this.stateApi}/by-country/${countryId}`).subscribe((res) => {
      this.states = res || [];

      // reset dependent
      this.districts = [];
      this.selectedStateName = '';
      this.orgForm.patchValue({ stateId: null, districtId: null });

      this.cdr.detectChanges();
    });
  }

  // ================= DISTRICT (FIXED) =================
  loadDistricts(stateId: number) {
    this.http.get<any[]>(`${this.districtApi}/by-state/${stateId}`).subscribe((res) => {
      this.districts = res || [];

      this.selectedDistrictName = '';
      this.orgForm.patchValue({ districtId: null });

      this.cdr.detectChanges();
    });
  }

  // ================= TENANT =================
  loadTenantTypes() {
    this.http.get<any[]>(this.tenantApi).subscribe((res) => {
      this.tenantTypes = res || [];
    });
  }

  isFormChanged(): boolean {

  if (!this.originalOrganizationData) {
    return true;
  }

  const current = this.orgForm.getRawValue();

  return (
    String(current.organizationCode).trim() !== String(this.originalOrganizationData.organizationCode).trim() ||
    String(current.organizationName).trim() !== String(this.originalOrganizationData.organizationName).trim() ||
    Number(current.tenantTypeId) !== Number(this.originalOrganizationData.tenantTypeId) ||
    Number(current.countryId) !== Number(this.originalOrganizationData.countryId) ||
    Number(current.stateId) !== Number(this.originalOrganizationData.stateId) ||
    Number(current.districtId) !== Number(this.originalOrganizationData.districtId) ||
    String(current.email).trim() !== String(this.originalOrganizationData.email).trim() ||
    String(current.phone).trim() !== String(this.originalOrganizationData.phone).trim()
  );
}

 loadOrganizations() {
  this.http.get<any[]>(this.api).subscribe({
    next: (res) => {

      console.log("Organizations:", res);

      this.organizations = res || [];

      this.filteredOrganizations = [...this.organizations];

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.showAlert(
        'error',
        'Error',
        'Failed to load organizations'
      );
    }
  });
}

  // ================= DROPDOWNS =================
  toggleTenantDropdown() {
    const isOpen = this.isTenantDropdownOpen;

    this.closeAllDropdowns();

    this.isTenantDropdownOpen = !isOpen;
  }

  toggleCountryDropdown() {
    const isOpen = this.isCountryDropdownOpen;

    this.closeAllDropdowns();

    this.isCountryDropdownOpen = !isOpen;
  }

  toggleStateDropdown() {
    const isOpen = this.isStateDropdownOpen;

    this.closeAllDropdowns();

    this.isStateDropdownOpen = !isOpen;
  }

  toggleDistrictDropdown() {
    const isOpen = this.isDistrictDropdownOpen;

    this.closeAllDropdowns();

    this.isDistrictDropdownOpen = !isOpen;
  }
  selectTenant(t: any) {
    this.selectedTenantName = t.typeName;
    this.orgForm.patchValue({ tenantTypeId: t.tenantTypeId });
    this.isTenantDropdownOpen = false;
  }

  selectCountry(c: any) {
    this.selectedCountryName = c.countryName;
    this.orgForm.patchValue({ countryId: c.countryId });

    this.loadStates(c.countryId);
    this.isCountryDropdownOpen = false;
  }

  selectState(s: any) {
    this.selectedStateName = s.stateName;
    this.orgForm.patchValue({ stateId: s.stateId });

    this.loadDistricts(s.stateId);
    this.isStateDropdownOpen = false;
  }

  selectDistrict(d: any) {
    this.selectedDistrictName = d.districtName;
    this.orgForm.patchValue({ districtId: d.districtId });
    this.isDistrictDropdownOpen = false;
  }

  closeAllDropdowns() {
    this.isTenantDropdownOpen = false;
    this.isCountryDropdownOpen = false;
    this.isStateDropdownOpen = false;
    this.isDistrictDropdownOpen = false;
  }

  // ================= SUBMIT =================
  onSubmit() {

  this.orgForm.markAllAsTouched();


  // =========================
  // EMPTY FORM
  // =========================

  if(
    !this.orgForm.value.tenantTypeId &&
    !this.orgForm.value.countryId &&
    !this.orgForm.value.stateId &&
    !this.orgForm.value.districtId &&
    !this.orgForm.get('organizationCode')?.value &&
    !this.orgForm.get('organizationName')?.value &&
    !this.orgForm.get('email')?.value &&
    !this.orgForm.get('phone')?.value
  ){
    this.showAlert(
      'warning',
      'Validation Error',
      'Please fill all the required fields'
    );
    return;
  }



  // =========================
  // ORGANIZATION CODE
  // =========================

  if (this.orgForm.get('organizationCode')?.hasError('required')) {

    this.showAlert(
      'warning',
      'Validation',
      'Organization Code is required'
    );

    return;
  }


  if (this.orgForm.get('organizationCode')?.hasError('pattern')) {

    this.showAlert(
      'warning',
      'Validation',
      'Organization Code must contain only letters and numbers'
    );

    return;
  }



  // =========================
  // ORGANIZATION NAME
  // =========================

  if (this.orgForm.get('organizationName')?.hasError('required')) {

    this.showAlert(
      'warning',
      'Validation',
      'Organization Name is required'
    );

    return;
  }


  if(this.orgForm.get('organizationName')?.hasError('pattern')) {

    this.showAlert(
      'warning',
      'Validation',
      'Organization Name should contain only letters'
    );

    return;
  }



  // =========================
  // DROPDOWNS
  // =========================


  if (!this.orgForm.value.countryId) {

    this.showAlert(
      'warning',
      'Validation',
      'Please select a Country'
    );

    return;
  }


  if (!this.orgForm.value.stateId) {

    this.showAlert(
      'warning',
      'Validation',
      'Please select a State'
    );

    return;
  }


  if (!this.orgForm.value.districtId) {

    this.showAlert(
      'warning',
      'Validation',
      'Please select a District'
    );

    return;
  }


  if (!this.orgForm.value.tenantTypeId) {

    this.showAlert(
      'warning',
      'Validation',
      'Please select a Tenant Type'
    );

    return;
  }




  // =========================
  // EMAIL
  // =========================


  if (this.orgForm.get('email')?.hasError('required')) {

    this.showAlert(
      'warning',
      'Validation',
      'Email is required'
    );

    return;
  }


  if (this.orgForm.get('email')?.hasError('email')) {

    this.showAlert(
      'warning',
      'Validation',
      'Please enter a valid email address'
    );

    return;
  }



  // =========================
  // PHONE
  // =========================


  if (this.orgForm.get('phone')?.hasError('required')) {

    this.showAlert(
      'warning',
      'Validation',
      'Phone Number is required'
    );

    return;
  }


  if(this.orgForm.get('phone')?.hasError('pattern')) {

    this.showAlert(
      'warning',
      'Validation',
      'Phone number must contain exactly 10 digits'
    );

    return;
  }



  const payload = this.orgForm.value;



  // =========================
  // UPDATE
  // =========================

  if (this.isEditMode) {


    if (!this.isFormChanged()) {

      this.showAlert(
        'warning',
        'No Changes',
        'No changes detected to update'
      );

      return;
    }


    this.http.put(`${this.api}/${this.editingId}`, payload)
    .subscribe({

      next:()=>{

        this.showAlert(
          'success',
          'Updated',
          'Updated successfully!'
        );

        this.loadOrganizations();
        this.resetForm();

      },

      error:(err)=>{

        this.showAlert(
          'error',
          'Error',
          err?.error || 'Update failed'
        );

      }

    });



  } else {


    // =========================
    // CREATE
    // =========================

    this.http.post(this.api,payload)
    .subscribe({

      next:()=>{

        this.showAlert(
          'success',
          'Created',
          'Created successfully!'
        );

        this.loadOrganizations();
        this.resetForm();

      },

      error:(err)=>{

        this.showAlert(
          'error',
          'Error',
          err?.error || 'Create failed'
        );

      }

    });

  }

}

  // ================= EDIT =================
  editOrganization(o: any) {
  this.isEditMode = true;
  this.editingId = o.organizationId;

  

  this.orgForm.patchValue({
    organizationCode: o.organizationCode,
    organizationName: o.organizationName,
    tenantTypeId: o.tenantTypeId,
    countryId: o.countryId,
    stateId: o.stateId,
    districtId: o.districtId,
    email: o.email,
    phone: o.phone
  });

  this.originalOrganizationData = {
    organizationCode: o.organizationCode,
    organizationName: o.organizationName,
    tenantTypeId: o.tenantTypeId,
    countryId: o.countryId,
    stateId: o.stateId,
    districtId: o.districtId,
    email: o.email,
    phone: o.phone
  };


  // Tenant Type
  const tenant = this.tenantTypes.find(
    t => t.tenantTypeId == o.tenantTypeId
  );

  this.selectedTenantName = tenant ? tenant.typeName : '';


  // Country
  this.selectedCountryName = o.countryName || '';


  // Load states first
  if (o.countryId) {

    this.http.get<any[]>(`${this.stateApi}/by-country/${o.countryId}`)
      .subscribe(res => {

        this.states = res || [];

        const state = this.states.find(
          s => s.stateId == o.stateId
        );

        this.selectedStateName = state ? state.stateName : '';


        // Load districts after states
        if (o.stateId) {

          this.http.get<any[]>(`${this.districtApi}/by-state/${o.stateId}`)
            .subscribe(res2 => {

              this.districts = res2 || [];


              const district = this.districts.find(
                d => d.districtId == o.districtId
              );


              this.selectedDistrictName =
                district ? district.districtName : '';

              this.cdr.detectChanges();

            });

        }

      });

  }
}

  // ================= DELETE =================
  deleteOrganization(id: number) {
    this.http.delete(`${this.api}/${id}`).subscribe(() => {
      this.showAlert('success', 'Deleted', 'Deleted successfully');
      this.loadOrganizations();
    });
  }

  // ================= RESET =================
  resetForm() {
    this.orgForm.reset();
    this.selectedTenantName = '';
    this.selectedCountryName = '';
    this.selectedStateName = '';
    this.selectedDistrictName = '';
    this.isEditMode = false;
    this.editingId = null;
  }

  // ================= SEARCH =================
  applySearch() {
    const term = this.searchText.toLowerCase();

    this.filteredOrganizations = this.organizations.filter(
      (o) =>
        o.organizationName?.toLowerCase().includes(term) ||
        o.organizationCode?.toLowerCase().includes(term),
    );
  }

  // ================= VALIDATION FIX =================
  hasError(control: string): boolean {
    const c = this.orgForm.get(control);
    return !!(c && c.invalid && c.touched);
  }

  // close dropdown
  @HostListener('document:click', ['$event'])
  closeDropdown(event: any) {
    if (!event.target.closest('.custom-select-wrapper')) {
      this.closeAllDropdowns();
    }
  }

  allowAlphaNumeric(event: KeyboardEvent): void {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight'
  ];

  if (allowedKeys.includes(event.key)) {
    return;
  }

  if (!/^[a-zA-Z0-9]$/.test(event.key)) {
    event.preventDefault();
  }
}

allowOnlyLetters(event: KeyboardEvent): void {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    ' '
  ];

  if (allowedKeys.includes(event.key)) {
    return;
  }

  if (!/^[a-zA-Z]$/.test(event.key)) {
    event.preventDefault();
  }
}
allowOnlyNumbers(event: KeyboardEvent): void {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight'
  ];

  if (allowedKeys.includes(event.key)) {
    return;
  }

  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault();
  }
}
}
