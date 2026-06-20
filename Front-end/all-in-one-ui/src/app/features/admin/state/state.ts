import {
  Component,
  HostListener,
  OnInit,
  ChangeDetectorRef
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

interface Country {
  countryId: number;
  countryName: string;
}

interface StateModel {
  stateId: number;
  stateName: string;
  countryId: number;
  countryName?: string;
}

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './state.html',
  styleUrls: ['./state.css']
})
export class State implements OnInit {

  stateForm!: FormGroup;

  isEditMode = false;
  editingId: number | null = null;

  searchText: string = '';

  countries: Country[] = [];
  states: StateModel[] = [];
  filteredStates: StateModel[] = [];

  isDropdownOpen = false;

  selectedCountryId: number | null = null;
  selectedCountryName: string = '';

  showCountryError = false;

  // ✅ original values for update validation
  originalStateName: string | null = null;
  originalCountryId: number | null = null;

  private stateApi = 'http://localhost:5019/api/State';
  private countryApi = 'http://localhost:5019/api/Country';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.stateForm = this.fb.group({
      stateName: ['', Validators.required]
    });

    this.loadCountries();
  }

  // =========================
  // LOAD COUNTRIES
  // =========================
  loadCountries(): void {

    this.http.get<Country[]>(this.countryApi).subscribe({
      next: (res) => {
        this.countries = res || [];
        this.loadStates();
      },
      error: (err) => console.error(err)
    });
  }

  // =========================
  // LOAD STATES
  // =========================
  loadStates(): void {

    this.http.get<StateModel[]>(this.stateApi).subscribe({
      next: (res) => {

        this.states = (res || []).map(state => ({
          ...state,
          countryName:
            this.countries.find(c => c.countryId === state.countryId)?.countryName || ''
        }));

        this.filteredStates = [...this.states];
        this.applySearch();

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // =========================
  // DROPDOWN
  // =========================
  @HostListener('document:click', ['$event'])
  closeDropdown(event: any): void {
    if (!event.target.closest('.custom-select-wrapper')) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCountry(country: Country): void {
    this.selectedCountryId = country.countryId;
    this.selectedCountryName = country.countryName;
    this.isDropdownOpen = false;
    this.showCountryError = false;
  }

  // =========================
  // CREATE / UPDATE
  // =========================
  onSubmit(): void {

    if (!this.selectedCountryId || this.stateForm.invalid) {

       this.showCountryError = !this.selectedCountryId;

  // Show form validation errors
  this.stateForm.markAllAsTouched();

  // BOTH EMPTY
  if (!this.selectedCountryId && this.stateForm.invalid) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all the required fields',
      showConfirmButton: false,
      timer: 2500
    });

    return;
  }

  // COUNTRY EMPTY
  if (!this.selectedCountryId) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Country is required',
      showConfirmButton: false,
      timer: 2500
    });

    return;
  }

  // STATE EMPTY
  if (this.stateForm.invalid) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'State is required',
      showConfirmButton: false,
      timer: 2500
    });

    return;
  }
    }

    const payload = {
      stateName: this.stateForm.value.stateName.trim(),
      countryId: this.selectedCountryId
    };

    const newName = payload.stateName.toLowerCase();

    // =========================
    // UPDATE
    // =========================
    if (this.isEditMode && this.editingId !== null) {

      const oldName = (this.originalStateName || '').toLowerCase();
      const oldCountry = this.originalCountryId;

      // ❌ NO CHANGE CHECK
      if (newName === oldName && this.selectedCountryId === oldCountry) {

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
      const duplicateExists = this.states.some(s =>
        s.stateId !== this.editingId &&
        s.stateName.toLowerCase() === newName &&
        s.countryId === this.selectedCountryId
      );

      if (duplicateExists) {

        Swal.fire({
          icon: 'warning',
          title: 'Duplicate Record',
          text: 'Another state with same name already exists in this country!'
        });

        return;
      }

      this.http.put(`${this.stateApi}/${this.editingId}`, payload)
        .subscribe({

          next: () => {

            Swal.fire({
              icon: 'success',
              title: 'Updated Successfully',
              text: 'State updated successfully!',
              timer: 2000,
              showConfirmButton: false
            });

            this.loadStates();
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
          }
        });
    }

    // =========================
    // CREATE
    // =========================
    else {

      const exists = this.states.some(s =>
        s.stateName.toLowerCase() === newName &&
        s.countryId === this.selectedCountryId
      );

      if (exists) {

        Swal.fire({
          icon: 'warning',
          title: 'Duplicate Record',
          text: 'This state already exists in selected country!'
        });

        return;
      }

      this.http.post(this.stateApi, payload)
        .subscribe({

          next: () => {

            Swal.fire({
              icon: 'success',
              title: 'Saved Successfully',
              text:'State created successfully!',
              timer: 2000,
              showConfirmButton: false
            });

            this.loadStates();
            this.resetForm();
          },

          error: (err) => {
            console.error(err);

            Swal.fire({
              icon: 'error',
              title: 'Save Failed',
              text: 'Something went wrong!',
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
    }
  }

  // =========================
  // EDIT
  // =========================
  editState(state: StateModel): void {

    this.isEditMode = true;
    this.editingId = state.stateId;

    this.stateForm.patchValue({
      stateName: state.stateName
    });

    this.selectedCountryId = state.countryId;
    this.selectedCountryName =
      this.countries.find(c => c.countryId === state.countryId)?.countryName || '';

    // store original values
    this.originalStateName = state.stateName;
    this.originalCountryId = state.countryId;
  }

  // =========================
  // DELETE
  // =========================
  deleteState(id: number): void {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this state?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        this.http.delete(`${this.stateApi}/${id}`)
          .subscribe({

            next: () => {

              Swal.fire({
                icon: 'success',
                title: 'Deleted Successfully!',
                text: 'State deleted successfully!',
                timer: 2000,
                showConfirmButton: false
              });

              this.loadStates();
            },

            error: (err) => {
              console.error(err);

              Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: 'Something went wrong!',
                showConfirmButton: false,
                timer: 2000
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

    this.stateForm.reset();

    this.selectedCountryId = null;
    this.selectedCountryName = '';

    this.isEditMode = false;
    this.editingId = null;

    this.showCountryError = false;

    this.originalStateName = null;
    this.originalCountryId = null;
  }

  // =========================
  // SEARCH
  // =========================
  applySearch(): void {

    const search = this.searchText.toLowerCase();

    this.filteredStates = this.states.filter(s =>
      s.stateName.toLowerCase().includes(search) ||
      (s.countryName || '').toLowerCase().includes(search)
    );
  }

  // =========================
  // VALIDATION HELPER (FIXED MISSING ERROR)
  // =========================
  hasError(control: string): boolean {
    const field = this.stateForm.get(control);
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