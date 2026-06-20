import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CountryService, Country } from '../services/country.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './country.html',
  styleUrls: ['./country.css']
})
export class CountryComponent implements OnInit {

  countryForm!: FormGroup;

  countries: Country[] = [];
  filteredCountries: Country[] = [];

  searchText = '';

  isEditMode = false;
  editId: number | null = null;

  // ✅ NEW: store original value for update validation
  originalCountryName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    console.log('Country Component Loaded');

    this.countryForm = this.fb.group({
      countryName: ['', Validators.required]
    });

    this.loadCountries();
  }

  // =========================
  // SWEET ALERT
  // =========================
  showAlert(
    icon: 'success' | 'error' | 'warning',
    title: string,
    text: string
  ): void {

    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonColor: '#2563eb',
      timer: 2500,
      showConfirmButton: false
    });
  }

  // =========================
  // LOAD COUNTRIES
  // =========================
  loadCountries(): void {

    this.countryService.getAll().subscribe({
      next: (data: Country[]) => {

        this.countries = data || [];
        this.filteredCountries = [...this.countries];

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(err);

        this.showAlert(
          'error',
          'Error',
          'Failed to load countries'
        );
      }
    });
  }

  // =========================
  // SEARCH
  // =========================
  applySearch(): void {

    const text = this.searchText.toLowerCase();

    this.filteredCountries = this.countries.filter(c =>
      c.countryName.toLowerCase().includes(text)
    );
  }

  // =========================
  // SAVE / UPDATE
  // =========================
  onSubmit(): void {

    if (this.countryForm.invalid) {

      this.countryForm.markAllAsTouched();

      this.showAlert(
        'warning',
        'Validation',
        'Country is required'
      );

      return;
    }

    const payload = {
      countryName: this.countryForm.value.countryName.trim()
    };

    // =========================
    // UPDATE
    // =========================
    if (this.isEditMode && this.editId !== null) {

  const newName = payload.countryName.toLowerCase();
  const oldName = (this.originalCountryName || '').toLowerCase();

  // ❌ No change check
  if (newName === oldName) {
    this.showAlert(
      'warning',
      'No Changes',
      'No changes were made to update!'
    );
    return;
  }

  // ❌ DUPLICATE CHECK (IMPORTANT ADDITION)
  const duplicateExists = this.countries.some(c =>
    c.countryId !== this.editId &&   // ignore current record
    c.countryName.toLowerCase() === newName
  );

  if (duplicateExists) {

    this.showAlert(
      'warning',
      'Duplicate Record',
      'Another country with this name already exists!'
    );

    return;
  }

  this.countryService.update(this.editId, payload)
    .subscribe({
      next: () => {

        this.showAlert(
          'success',
          'Updated',
          'Country updated successfully!'
        );

        this.loadCountries();
        this.resetForm();
      },

      error: (err) => {
        console.error(err);

        this.showAlert(
          'error',
          'Error',
          'Operation failed!'
        );
      }
    });
}

    // =========================
    // CREATE
    // =========================
    else {

      const newName = payload.countryName.toLowerCase();

      // ❌ Duplicate check
      const exists = this.countries.some(c =>
        c.countryName.toLowerCase() === newName
      );

      if (exists) {
        this.showAlert(
          'warning',
          'Duplicate Record',
          'This country already exists!'
        );
        return;
      }

      this.countryService.create(payload)
        .subscribe({
          next: () => {

            this.showAlert(
              'success',
              'Created',
              'Country created successfully!'
            );

            this.loadCountries();
            this.resetForm();
          },

          error: (err) => {
            console.error(err);

            this.showAlert(
              'error',
              'Error',
              'Operation failed!'
            );
          }
        });
    }
  }

  // =========================
  // EDIT
  // =========================
  editCountry(country: Country): void {

    this.isEditMode = true;
    this.editId = country.countryId;

    // store original value
    this.originalCountryName = country.countryName;

    this.countryForm.patchValue({
      countryName: country.countryName
    });
  }

  // =========================
  // DELETE
  // =========================
  deleteCountry(id: number): void {

    Swal.fire({
      title: 'Delete Country?',
      text: 'Are you sure you want to delete this country?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {

      if (result.isConfirmed) {

        this.countryService.delete(id)
          .subscribe({
            next: () => {

              this.showAlert(
                'success',
                'Deleted',
                'Country deleted successfully!'
              );

              this.loadCountries();
            },

            error: (err) => {

              console.error(err);

              this.showAlert(
                'error',
                'Error',
                'Operation failed!'
              );
            }
          });
      }
    });
  }

  // =========================
  // RESET
  // =========================
  resetForm(): void {

    this.countryForm.reset();

    this.isEditMode = false;
    this.editId = null;

    // reset original value
    this.originalCountryName = null;
  }

  // =========================
  // VALIDATION HELPER
  // =========================
  hasError(controlName: string): boolean {

    const control = this.countryForm.get(controlName);

    return !!(control && control.invalid && control.touched);
  }

  allowOnlyLetters(event: KeyboardEvent): void {
  const char = event.key;

  // Allow only letters and spaces
  if (!/^[a-zA-Z ]$/.test(char)) {
    event.preventDefault();
  }
}
}