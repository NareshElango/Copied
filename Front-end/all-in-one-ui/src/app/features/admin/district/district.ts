import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

@Component({
  selector: 'app-district',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './district.html',
  styleUrls: ['./district.css']
})
export class District implements OnInit {

  districtForm!: FormGroup;

  isEditMode = false;

  searchText: string = '';

  filteredDistricts: any[] = [];

  states: any[] = [];
  districts: any[] = [];

  editingId: number | null = null;

  isDropdownOpen = false;
  originalDistrictName: string | null = null;
  originalStateId: number | null = null;
  selectedStateName = '';

  private districtApi = 'http://localhost:5019/api/district';
  private stateApi = 'http://localhost:5019/api/state';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    console.log('District Component Loaded');

    this.districtForm = this.fb.group({
      stateId: [null, Validators.required],
      districtName: ['', Validators.required]
    });

    // LOAD STATES FIRST
    this.loadStates();
  }

  // =========================
  // LOAD STATES
  // =========================
  loadStates(): void {

    console.log('Loading States...');

    this.http.get<any[]>(this.stateApi).subscribe({

      next: (res) => {

        console.log('States Loaded:', res);

        this.states = res || [];

        // LOAD DISTRICTS AFTER STATES
        this.loadDistricts();
      },

      error: (err) => {
        console.error('Error loading states', err);
      }
    });
  }

  // =========================
  // LOAD DISTRICTS
  // =========================
  loadDistricts(): void {

    console.log('Loading Districts...');

    this.http.get<any[]>(this.districtApi).subscribe({

      next: (res) => {

        console.log('Districts Loaded:', res);

        this.districts = res || [];

        this.filteredDistricts = [...this.districts];

        this.applySearch();

        // FORCE UI UPDATE
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error loading districts', err);
      }
    });
  }

  // =========================
  // SAVE / UPDATE
  // =========================
  onSubmit(): void {

  // if (this.districtForm.invalid) {

  //   this.districtForm.markAllAsTouched();

  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Validation Error',
  //     text: 'Please fill all required fields',
  //     confirmButtonColor: '#2563eb'
  //   });

  //   return;
  // }

  if(!this.districtForm.value.districtName && !this.districtForm.value.stateId) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all the required fields',
      timer: 2500,
      showConfirmButton: false
    });
    return;
  }

    if(!this.districtForm.value.stateId) { 
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'State is required',
        showConfirmButton: false,
        timer: 2500
      });
      return;
    }
    if(!this.districtForm.value.districtName) { 
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'District is required',
        showConfirmButton: false,
        timer: 2500
      });
    
    return;
  }
  
  const value = this.districtForm.value;

  const newName = value.districtName.toLowerCase();

  // =========================
  // UPDATE
  // =========================
  if (this.isEditMode && this.editingId !== null) {

    const oldName = (this.originalDistrictName || '').toLowerCase();
    const oldState = this.originalStateId;

    // ❌ NO CHANGE CHECK
    if (newName === oldName && value.stateId === oldState) {

      Swal.fire({
        icon: 'warning',
        title: 'No Changes',
        text: 'No changes were made to update!',
        showConfirmButton: false,
        timer: 2500
      });

      return;
    }

    // ❌ DUPLICATE CHECK (UPDATE FIX)
    const duplicateExists = this.districts.some(d =>
      d.districtId !== this.editingId &&
      d.districtName.toLowerCase() === newName &&
      d.stateId === value.stateId
    );

    if (duplicateExists) {

      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Record',
        text: 'Another district with same name already exists in this state!'
      });

      return;
    }

    this.http.put(`${this.districtApi}/${this.editingId}`, value)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'District updated successfully!',
            timer: 2000,
            showConfirmButton: false
          });

          this.loadDistricts();
          this.resetForm();
        },

        error: (err) => {
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Update operation failed!',
            confirmButtonColor: '#dc2626'
          });
        }
      });
  }

  // =========================
  // CREATE
  // =========================
  else {

    // ❌ DUPLICATE CHECK (CREATE FIX)
    const exists = this.districts.some(d =>
      d.districtName.toLowerCase() === newName &&
      d.stateId === value.stateId
    );

    if (exists) {

      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Record',
        text: 'This district already exists in selected state!'
      });

      return;
    }

    this.http.post(this.districtApi, value)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'District created successfully!',
            timer: 2000,
            showConfirmButton: false
          });

          this.loadDistricts();
          this.resetForm();
        },

        error: (err) => {
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Create operation failed!',
            confirmButtonColor: '#dc2626'
          });
        }
      });
  }
}

  // =========================
  // EDIT
  // =========================
  editDistrict(district: any): void {

  this.isEditMode = true;
  this.editingId = district.districtId;

  this.districtForm.patchValue({
    stateId: district.stateId,
    districtName: district.districtName
  });

  this.selectedStateName = this.getStateName(district.stateId);

  // ✅ STORE ORIGINAL VALUES
  this.originalDistrictName = district.districtName;
  this.originalStateId = district.stateId;
}

  // =========================
  // DELETE
  // =========================
  deleteDistrict(id: number): void {

     Swal.fire({
    title: 'Delete District?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  }).then((result) => {

    if (result.isConfirmed) {

      this.http.delete(`${this.districtApi}/${id}`)
        .subscribe({

          next: () => {

            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'District deleted successfully!',
              timer: 2000,
              showConfirmButton: false
            });

            this.loadDistricts();
          },

          error: (err) => {

            console.error('Delete failed', err);

            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Delete operation failed!',
              confirmButtonColor: '#dc2626'
            });
          }
        });
    }
      });
  }

  // =========================
  // RESET
  // =========================
 resetForm(): void {

  this.districtForm.reset();

  this.isEditMode = false;
  this.editingId = null;

  this.selectedStateName = '';
  this.isDropdownOpen = false;

  // ✅ reset originals
  this.originalDistrictName = null;
  this.originalStateId = null;
}

  // =========================
  // SEARCH
  // =========================
  applySearch(): void {

    const search = this.searchText.toLowerCase();

    this.filteredDistricts = this.districts.filter(d =>

      d.districtName.toLowerCase().includes(search) ||

      this.getStateName(d.stateId)
        .toLowerCase()
        .includes(search)
    );
  }

  // =========================
  // VALIDATION
  // =========================
  hasError(control: string): boolean {

    const field = this.districtForm.get(control);

    return !!(
      field &&
      field.invalid &&
      field.touched
    );
  }

  // =========================
  // GET STATE NAME
  // =========================
  getStateName(id: number): string {

    return this.states.find(
      s => s.stateId === id
    )?.stateName || '';
  }

  // =========================
  // DROPDOWN
  // =========================
  toggleDropdown(): void {

    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectState(state: any): void {

    this.selectedStateName = state.stateName;

    this.districtForm.patchValue({
      stateId: state.stateId
    });

    this.isDropdownOpen = false;
  }

  // =========================
  // CLOSE DROPDOWN
  // =========================
  @HostListener('document:click', ['$event'])
  closeDropdown(event: any): void {

    if (!event.target.closest('.custom-select-wrapper')) {

      this.isDropdownOpen = false;
    }
  }

  allowOnlyLetters(event: KeyboardEvent): void {
  const char = event.key;

  // Allow only letters and spaces
  if (!/^[a-zA-Z ]$/.test(char)) {
    event.preventDefault();
  }
}
}