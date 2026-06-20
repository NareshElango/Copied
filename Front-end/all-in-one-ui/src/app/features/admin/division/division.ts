import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-division',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './division.html',
  styleUrls: ['./division.css'],
})
export class Division implements OnInit {
  divisionForm!: FormGroup;

  isEditMode = false;

  searchText: string = '';

  districts: any[] = [];
  divisions: any[] = [];
  filteredDivisions: any[] = [];
  originalDivisionName: string | null = null;
  originalDistrictId: number | null = null;
  editingId: number | null = null;

  // =========================
  // DROPDOWN
  // =========================
  isDropdownOpen = false;

  selectedDistrictId: number | null = null;

  selectedDistrictName: string = '';

  showDistrictError = false;

  // =========================
  // API
  // =========================
  private divisionApi = 'http://localhost:5019/api/Division';

  private districtApi = 'http://localhost:5019/api/District';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    console.log('Division Component Loaded');

    this.divisionForm = this.fb.group({
      divisionName: ['', Validators.required],
    });

    // LOAD DISTRICTS FIRST
    this.loadDistricts();
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

        // LOAD DIVISIONS AFTER DISTRICTS
        this.loadDivisions();
      },

      error: (err) => {
        console.error('District load error', err);
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

        this.filteredDivisions = [...this.divisions];

        this.applySearch();

        // FORCE UI REFRESH
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Division load error', err);
      },
    });
  }

  // =========================
  // OUTSIDE CLICK CLOSE
  // =========================
  @HostListener('document:click', ['$event'])
  closeDropdown(event: any): void {
    if (!event.target.closest('.custom-select-wrapper')) {
      this.isDropdownOpen = false;
    }
  }

  // =========================
  // TOGGLE DROPDOWN
  // =========================
  toggleDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // =========================
  // SELECT DISTRICT
  // =========================
  selectDistrict(district: any, event: Event): void {
    event.stopPropagation();

    this.selectedDistrictId = district.districtId;

    this.selectedDistrictName = district.districtName;

    this.isDropdownOpen = false;

    this.showDistrictError = false;

    console.log('Selected District:', district);
  }

  // =========================
  // SAVE / UPDATE
  // =========================
  onSubmit(): void {
    this.divisionForm.markAllAsTouched();

  const districtId = this.selectedDistrictId;
  const divisionName = this.divisionForm.value.divisionName?.trim();

  // BOTH EMPTY
  if (!districtId && !divisionName) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all the required fields!',
      showConfirmButton: false,
      timer: 2500
    });

    return;
  }

  // DISTRICT EMPTY
  if (!districtId) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'District is required',
      showConfirmButton: false,
      timer: 2500
    });

    return;
  }

  // DIVISION NAME EMPTY
  if (!divisionName) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Division is required',
      showConfirmButton: false,
      timer: 2500
    });

    return;
  }

    const payload = {
      divisionName: this.divisionForm.value.divisionName.trim(),
      districtId: this.selectedDistrictId,
    };

    const newName = payload.divisionName.toLowerCase();

    // =========================
    // UPDATE
    // =========================
    if (this.isEditMode && this.editingId !== null) {
      const oldName = (this.originalDivisionName || '').toLowerCase();
      const oldDistrict = this.originalDistrictId;

      // ❌ NO CHANGE CHECK
      if (newName === oldName && this.selectedDistrictId === oldDistrict) {
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
      const duplicateExists = this.divisions.some(
        (d) =>
          d.divisionId !== this.editingId &&
          d.divisionName.toLowerCase() === newName &&
          d.districtId === this.selectedDistrictId,
      );

      if (duplicateExists) {
        Swal.fire({
          icon: 'warning',
          title: 'Duplicate Record',
          text: 'Another division with same name already exists in this district!',
          showConfirmButton: false,
          timer: 2000
        });

        return;
      }

      this.http
        .put(`${this.divisionApi}/${this.editingId}`, {
          divisionId: this.editingId,
          ...payload,
        })
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Updated Successfully',
              text: 'Division updated successfully!',
              timer: 2000,
              showConfirmButton: false,
            });

            this.loadDivisions();
            this.resetForm();
          },

          error: (err) => {
            console.error(err);

            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'Something went wrong!',
              showConfirmButton: false,
              timer: 2000
            });
          },
        });
    }

    // =========================
    // CREATE
    // =========================
    else {
      // ❌ DUPLICATE CHECK (CREATE FIX)
      const exists = this.divisions.some(
        (d) => d.divisionName.toLowerCase() === newName && d.districtId === this.selectedDistrictId,
      );

      if (exists) {
        Swal.fire({
          icon: 'warning',
          title: 'Duplicate Record',
          text: 'This division already exists in selected district!',
          showConfirmButton: false,
          timer: 2000
        });

        return;
      }

      this.http.post(this.divisionApi, payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Saved Successfully',
            text: 'Division created successfully',
            timer: 2000,
            showConfirmButton: false,
          });

          this.loadDivisions();
          this.resetForm();
        },

        error: (err) => {
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Save Failed',
            text: 'Something went wrong',
            showConfirmButton: false,
            timer: 2000
          });
        },
      });
    }
  }

  // =========================
  // EDIT
  // =========================
  editDivision(div: any): void {
    this.isEditMode = true;

    this.editingId = div.divisionId;

    this.divisionForm.patchValue({
      divisionName: div.divisionName,
    });

    this.selectedDistrictId = div.districtId;

    this.selectedDistrictName =
      this.districts.find((d) => d.districtId === div.districtId)?.districtName || '';

    this.originalDivisionName = div.divisionName;
    this.originalDistrictId = div.districtId;
  }

  // =========================
  // DELETE
  // =========================
  deleteDivision(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this division?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#0f172a',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.divisionApi}/${id}`).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted Successfully',
              text: 'Division deleted successfully!',
              timer: 2000,
              showConfirmButton: false,
              background: '#ffffff',
              color: '#0f172a',
            });
            this.loadDivisions();
          },
          error: (err) => {
            console.error('Delete error', err);
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: 'Something went wrong',
              confirmButtonColor: '#dc2626',
              background: '#ffffff',
              color: '#0f172a',
            });
          },
        });
      }
    });
  }

  // =========================
  // RESET
  // =========================
  resetForm(): void {
    this.divisionForm.reset();

    this.selectedDistrictId = null;

    this.selectedDistrictName = '';

    this.isEditMode = false;

    this.editingId = null;

    this.showDistrictError = false;

    this.isDropdownOpen = false;
    this.originalDivisionName = null;
    this.originalDistrictId = null;
  }

  // =========================
  // SEARCH
  // =========================
  applySearch(): void {
    const search = this.searchText.toLowerCase();

    this.filteredDivisions = this.divisions.filter(
      (d) =>
        (d.divisionName || '').toLowerCase().includes(search) ||
        this.getDistrictName(d.districtId).toLowerCase().includes(search),
    );
  }

  // =========================
  // GET DISTRICT NAME
  // =========================
  getDistrictName(id: number): string {
    return this.districts.find((d) => d.districtId === id)?.districtName || '';
  }

  // =========================
  // VALIDATION
  // =========================
  hasError(control: string): boolean {
    const field = this.divisionForm.get(control);

    return !!(field && field.invalid && field.touched);
  }

  allowOnlyLetters(event: KeyboardEvent): void {
  const char = event.key;

  // Allow only letters and spaces
  if (!/^[a-zA-Z ]$/.test(char)) {
    event.preventDefault();
  }
}
}
