import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class RoleComponent implements OnInit {
  roleForm!: FormGroup;

  roles: any[] = [];
  filteredRoles: any[] = [];

  searchText: string = '';

  isEditMode = false;
  editId: number | null = null;

  private roleApi = 'http://localhost:5019/api/Role';
  actions: any[] = [];

  selectedActionIds: number[] = [];

  isActionDropdownOpen = false;

  actionSearch = '';

  private actionApi = 'http://localhost:5019/api/Action';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}
  showAlert(icon: 'success' | 'error' | 'warning' | 'info', title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#2563eb',
      timer: 2000,
      showConfirmButton: false,
    });
  }
  ngOnInit() {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      actionIds: [[],Validators.required],
    });

    this.loadRoles();
    this.loadActions();
  }
  toggleActionDropdown() {
    this.isActionDropdownOpen = !this.isActionDropdownOpen;
  }

  filteredActions() {
    const term = this.actionSearch.toLowerCase();

    return this.actions.filter((x) => (x.actionTitle || '').toLowerCase().includes(term));
  }

  toggleAction(action: any, event: Event) {
    event.stopPropagation();

    const index = this.selectedActionIds.indexOf(action.actionId);

    if (index > -1) {
      this.selectedActionIds.splice(index, 1);
    } else {
      this.selectedActionIds.push(action.actionId);
    }

    this.syncActions();
  }

  syncActions() {
    this.roleForm.patchValue({
      actionIds: [...this.selectedActionIds],
    });
  }

  isActionSelected(id: number): boolean {
    return this.selectedActionIds.includes(id);
  }

  removeAction(id: number) {
    this.selectedActionIds = this.selectedActionIds.filter((x) => x !== id);

    this.syncActions();
  }

  loadActions() {
    this.http.get<any[]>(this.actionApi).subscribe({
      next: (res) => {
        this.actions = res || [];
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  // =========================
  // LOAD ROLES (FIXED)
  // =========================
  loadRoles() {
    this.http.get<any[]>(this.roleApi).subscribe({
      next: (res) => {
        this.roles = res || [];

        this.filteredRoles = [...this.roles]; // 🔥 IMPORTANT FIX

        this.applySearch();

        this.cdr.detectChanges(); // 🔥 FORCE UI UPDATE

        console.log('Roles loaded:', this.roles);
      },
      error: (err) => {
        console.error('Load error', err);

        this.showAlert('error', 'Error', 'Failed to load roles');
      },
    });
  }

  // =========================
  // CREATE / UPDATE
  // =========================
  onSubmit() {
    if(!this.roleForm.value.roleName&&!this.selectedActionIds){
      this.showAlert('warning', 'Validation Error', 'Please fill all the required fields');
      return;
    }

    if(!this.roleForm.value.roleName){
      this.showAlert('warning', 'Validation Error', 'Role Name is required');
      return;
    }
    
    if(!this.selectedActionIds || this.selectedActionIds.length === 0){
      this.showAlert('warning', 'Validation Error', 'Please select at least one action');
      return;
    }

    const payload = {
      roleName: this.roleForm.value.roleName,
      actionIds: this.selectedActionIds,
    };

    // UPDATE
    if (this.isEditMode && this.editId !== null) {
      if (this.isDuplicateRole(this.roleForm.value.roleName, null)) {
        this.showAlert('warning', 'Duplicate Role', 'Role already exists!');
        return;
      }
      this.http.put(`${this.roleApi}/${this.editId}`, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Updated', 'Role updated successfully!');

          this.loadRoles();
          this.resetForm();
        },

        error: (err) => {
          console.error('Update error', err);

          this.showAlert('error', 'Error', err?.error || 'Update failed');
        },
      });
    }

    // CREATE
    else {
      if (this.isDuplicateRole(this.roleForm.value.roleName, null)) {
        this.showAlert('warning', 'Duplicate Role', 'Role already exists!');
        return;
      }
      this.http.post(this.roleApi, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Created', 'Role created successfully!');

          this.loadRoles();
          this.resetForm();
        },

        error: (err) => {
          console.error('Create error', err);

          this.showAlert('error', 'Error', err?.error || 'Create failed');
        },
      });
    }
  }

  // =========================
  // EDIT
  // =========================
  editRole(role: any) {
    this.isEditMode = true;

    this.editId = role.roleId;

    const actionIds = role.actionIds || [];

    this.selectedActionIds = [...actionIds];

    this.roleForm.patchValue({
      roleName: role.roleName,
      actionIds: actionIds,
    });
  }

  // =========================
  // DELETE
  // =========================
  deleteRole(id: number) {
    Swal.fire({
      title: 'Delete Role?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.roleApi}/${id}`).subscribe({
          next: () => {
            this.showAlert('success', 'Deleted', 'Role deleted successfully!');

            this.loadRoles();
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
  resetForm() {
    this.roleForm.reset();

    this.selectedActionIds = [];

    this.isEditMode = false;

    this.editId = null;

    this.actionSearch = '';

    this.isActionDropdownOpen = false;
  }

  // =========================
  // SEARCH (FIXED)
  // =========================
  applySearch() {
    const term = this.searchText.toLowerCase();

    this.filteredRoles = [...this.roles].filter((r) =>
      (r.roleName || '').toLowerCase().includes(term),
    );
  }

  // =========================
  // VALIDATION
  // =========================
  hasError(controlName: string): boolean {
    const control = this.roleForm.get(controlName);

    return !!(control && control.invalid && control.touched);
  }

  isDuplicateRole(roleName: string, ignoreId: number | null = null): boolean {
    const name = (roleName || '').trim().toLowerCase();

    return this.roles.some((r) => {
      const existingName = (r.roleName || '').trim().toLowerCase();

      // skip current record in edit mode
      const isSameRecord = ignoreId && r.roleId === ignoreId;

      return existingName === name && !isSameRecord;
    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.multi-select-wrapper')) {
      this.isActionDropdownOpen = false;
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
