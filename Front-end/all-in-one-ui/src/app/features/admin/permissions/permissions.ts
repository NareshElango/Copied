import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './permissions.html',
  styleUrl: './permissions.css',
})
export class PermissionComponent implements OnInit {
  permissionForm!: FormGroup;

  permissions: any[] = [];
  filteredPermissions: any[] = [];

  searchText = '';

  isEditMode = false;
  editId: number | null = null;

  apiUrl = 'http://localhost:5019/api/Permission';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef, // ✅ IMPORTANT FIX
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.permissionForm = this.fb.group({
      permissionName: ['', Validators.required],
    });

    this.loadPermissions();
  }

  // ================= ALERT =================
  showAlert(icon: any, title: string, text: string) {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#2563eb',
      timer: 2000,
      showConfirmButton: false,
    });
  }

  // ================= LOAD (FIXED UI UPDATE) =================
  loadPermissions(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        console.log('Permissions loaded:', res);

        this.permissions = res || [];
        this.filteredPermissions = [...this.permissions];

        // 🔥 FORCE UI UPDATE (MAIN FIX)
        this.cdr.detectChanges();
      },
      error: () => {
        this.showAlert('error', 'Error', 'Unable to load permissions');
      },
    });
  }

  // ================= CREATE / UPDATE =================
  onSubmit(): void {
    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      this.showAlert('warning', 'Validation', 'Enter permission name');
      return;
    }

    const payload = {
      permissionName: this.permissionForm.value.permissionName,
    };

    // ================= UPDATE =================
    if (this.isEditMode && this.editId) {
      if (this.isDuplicatePermission(this.permissionForm.value.permissionName, null)) {
        this.showAlert('warning', 'Duplicate', 'Permission already exists');
        return;
      }
      this.http.put(`${this.apiUrl}/${this.editId}`, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Updated', 'Permission updated');

          this.resetForm();
          this.loadPermissions(); // 🔥 REFRESH
        },
        error: () => {
          this.showAlert('error', 'Error', 'Update failed');
        },
      });
    }

    // ================= CREATE =================
    else {
      if (this.isDuplicatePermission(this.permissionForm.value.permissionName, null)) {
        this.showAlert('warning', 'Duplicate', 'Permission already exists');
        return;
      }
      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Created', 'Permission created');

          this.resetForm();
          this.loadPermissions(); // 🔥 REFRESH
        },
        error: () => {
          this.showAlert('error', 'Error', 'Create failed');
        },
      });
    }
  }

  // ================= EDIT =================
  editPermission(p: any): void {
    this.isEditMode = true;
    this.editId = p.permissionId;

    this.permissionForm.patchValue({
      permissionName: p.permissionName,
    });

    // this.showAlert('info', 'Edit Mode', 'Editing permission');
  }

  // ================= DELETE =================
  deletePermission(id: number): void {
    Swal.fire({
      title: 'Delete Permission?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes,Delete',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
          next: () => {
            this.showAlert('success', 'Deleted', 'Permission deleted');

            this.loadPermissions(); // 🔥 REFRESH
          },
          error: () => {
            this.showAlert('error', 'Error', 'Delete failed');
          },
        });
      }
    });
  }

  // ================= RESET =================
  resetForm(): void {
    this.permissionForm.reset();
    this.isEditMode = false;
    this.editId = null;
  }

  // ================= SEARCH =================
  applySearch(): void {
    const term = this.searchText.toLowerCase();

    this.filteredPermissions = this.permissions.filter((p) =>
      p.permissionName?.toLowerCase().includes(term),
    );
  }

  // ================= VALIDATION =================
  hasError(controlName: string): boolean {
    const control = this.permissionForm.get(controlName);

    return !!(control && control.invalid && control.touched);
  }

  isDuplicatePermission(permissionName: string, ignoreId: number | null = null): boolean {
    const name = (permissionName || '').trim().toLowerCase();

    return this.permissions.some((p) => {
      const existing = (p.permissionName || '').trim().toLowerCase();

      // skip current record in edit mode
      const isSameRecord = ignoreId && p.permissionId === ignoreId;

      return existing === name && !isSameRecord;
    });
  }
}
