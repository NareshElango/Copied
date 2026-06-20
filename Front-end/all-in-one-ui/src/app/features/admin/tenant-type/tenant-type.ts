import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tenant-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './tenant-type.html',
  styleUrls: ['./tenant-type.css'],
})
export class TenantType implements OnInit {
  tenantForm!: FormGroup;
  originalTypeName: string | null = null;
  originalDescription: string | null = null;
  tenantTypes: any[] = [];
  filteredTenantTypes: any[] = [];

  searchText = '';

  isEditMode = false;

  editingId: number | null = null;

  private api = 'http://localhost:5019/api/TenantType';

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
    console.log('Tenant Type Component Loaded');

    this.tenantForm = this.fb.group({
      typeName: ['', Validators.required],
      description: ['',Validators.required],
    });

    this.loadTenantTypes();
  }

  // =========================
  // LOAD DATA
  // =========================
  loadTenantTypes(): void {
    console.log('Loading Tenant Types...');

    this.http.get<any[]>(this.api).subscribe({
      next: (res) => {
        console.log('Tenant Types Loaded:', res);

        this.tenantTypes = res || [];

        this.filteredTenantTypes = [...this.tenantTypes];

        this.applySearch();

        // FORCE UI REFRESH
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Load error', err);

        this.showAlert('error', 'Error', 'Failed to load tenant types');
      },
    });
  }

  // =========================
  // SAVE / UPDATE
  // =========================
  onSubmit(): void {
   const typename=this.tenantForm.value.typeName?.trim();
    const description=this.tenantForm.value.description?.trim();

    if(!typename && !description){
      this.showAlert('warning', 'Validation Error', 'Please fill all the required fields');
      return;
    }
    if(!typename){
      this.showAlert('warning', 'Validation Error', 'Type Name is required');
      return;
    }

    if(!description){
      this.showAlert('warning', 'Validation Error', 'Description is required');
      return;
    }
    const payload = this.tenantForm.value;

    const newName = (payload.typeName || '').toLowerCase();
    const newDesc = (payload.description || '').toLowerCase();

    // =========================
    // UPDATE
    // =========================
    if (this.isEditMode && this.editingId !== null) {
      const oldName = (this.originalTypeName || '').toLowerCase();
      const oldDesc = (this.originalDescription || '').toLowerCase();

      // ❌ NO CHANGE CHECK (BOTH FIELDS)
      if (newName === oldName && newDesc === oldDesc) {
        this.showAlert('warning', 'No Changes', 'No changes were made to update!');

        return;
      }

      // ❌ DUPLICATE CHECK (UPDATE - BOTH NAME + DESCRIPTION)
      const duplicateExists = this.tenantTypes.some(
        (t) =>
          t.tenantTypeId !== this.editingId &&
          (t.typeName || '').toLowerCase() === newName &&
          (t.description || '').toLowerCase() === newDesc,
      );

      if (duplicateExists) {
        this.showAlert(
          'warning',
          'Duplicate Record',
          'Another tenant type with same name and description already exists!',
        );

        return;
      }

      this.http.put(`${this.api}/${this.editingId}`, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Updated', 'Tenant Type updated successfully!');

          this.loadTenantTypes();
          this.resetForm();
        },

        error: (err) => {
          console.error(err);

          this.showAlert('error', 'Error', 'Update failed');
        },
      });
    }

    // =========================
    // CREATE
    // =========================
    else {
      // ❌ DUPLICATE CHECK (CREATE - ONLY TYPE NAME)
      const exists = this.tenantTypes.some((t) => (t.typeName || '').toLowerCase() === newName);

      if (exists) {
        this.showAlert('warning', 'Duplicate Record', 'This tenant type already exists!');

        return;
      }

      this.http.post(this.api, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Created', 'Tenant Type created successfully!');

          this.loadTenantTypes();
          this.resetForm();
        },

        error: (err) => {
          console.error(err);

          this.showAlert('error', 'Error', 'Create failed');
        },
      });
    }
  }

  // =========================
  // EDIT
  // =========================
  edit(t: any): void {
    this.isEditMode = true;

    this.editingId = t.tenantTypeId;

    this.tenantForm.patchValue({
      typeName: t.typeName,

      description: t.description,
    });
    this.originalTypeName = t.typeName;
    this.originalDescription = t.description;
  }

  // =========================
  // DELETE
  // =========================
  delete(id: number): void {
    Swal.fire({
      title: 'Delete Tenant Type?',
      text: 'Are you sure you want to delete this tenant type?',
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
            this.showAlert('success', 'Deleted', 'Tenant Type deleted successfully!');

            this.loadTenantTypes();
          },

          error: (err) => {
            console.error('Delete error', err);

            this.showAlert('error', 'Error', 'Delete failed');
          },
        });
      }
    });
  }

  // =========================
  // RESET
  // =========================
  resetForm(): void {
    this.tenantForm.reset();

    this.isEditMode = false;

    this.editingId = null;
    this.originalTypeName = null;
    this.originalDescription = null;
  }

  // =========================
  // SEARCH
  // =========================
  applySearch(): void {
    const term = this.searchText.toLowerCase();

    this.filteredTenantTypes = this.tenantTypes.filter(
      (t) =>
        (t.typeName || '').toLowerCase().includes(term) ||
        (t.description || '').toLowerCase().includes(term),
    );
  }

  // =========================
  // VALIDATION
  // =========================
  hasError(control: string): boolean {
    const field = this.tenantForm.get(control);

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
