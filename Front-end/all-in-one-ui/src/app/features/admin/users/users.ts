import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class User implements OnInit {
  userForm!: FormGroup;
  selectedRoles: any[] = []; // keep for UI
  selectedRole: any = null; // add
  selectedPermissions: any[] = [];

  roleSearch = '';
  permissionSearch = '';
  users: any[] = [];
  filteredUsers: any[] = [];

  organizations: any[] = [];
  branches: any[] = [];
  filteredBranches: any[] = [];

  userTypes: any[] = [];

  searchText = '';

  // dropdown states
  isOrgDropdownOpen = false;
  isBranchDropdownOpen = false;
  isUserTypeDropdownOpen = false;

  selectedOrgName = '';
  selectedBranchName = '';
  selectedUserTypeName = '';

  isEditMode = false;
  editId: number | null = null;

  roles: any[] = [];
  permissions: any[] = [];

  isRoleDropdownOpen = false;
  isPermissionDropdownOpen = false;

  selectedRoleName = '';
  selectedPermissionName = '';

  // ✅ API URLs
  private userApi = 'http://localhost:5019/api/User';
  private orgApi = 'http://localhost:5019/api/Organization';
  private branchApi = 'http://localhost:5019/api/OrganizationBranch';
  private userTypeApi = 'http://localhost:5019/api/UserType';
  private roleApi = 'http://localhost:5019/api/Role';
  private permissionApi = 'http://localhost:5019/api/Permission';

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
      // confirmButtonColor: '#2563eb',
      timer: 2500,
      showConfirmButton: false,
    });
  }
  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]  ],
      // password: ['', Validators.required], // ✅ must match DTO
      organizationId: [null, Validators.required],
      branchId: [null, Validators.required],
      userTypeId: [null, Validators.required],
      roleId: [null, Validators.required],
    });

    this.loadUsers();
    this.loadOrganizations();
    this.loadBranches();
    this.loadRoles();
    this.loadPermissions();
    this.loadUserTypes();
  }

  toggleRoleDropdown(event?: Event) {
    event?.stopPropagation();

    const isOpen = this.isRoleDropdownOpen;

    this.closeAllDropdowns();

    this.isRoleDropdownOpen = !isOpen;
  }

  togglePermissionDropdown(event?: Event) {
    event?.stopPropagation();

    const isOpen = this.isPermissionDropdownOpen;

    this.closeAllDropdowns();

    this.isPermissionDropdownOpen = !isOpen;
  }

  selectRole(r: any, event?: Event) {
    event?.stopPropagation();

    this.selectedRole = r;

    this.selectedRoleName = r.roleName;

    this.userForm.patchValue({
      roleId: r.roleId,
    });

    this.isRoleDropdownOpen = false;

    this.closeAllDropdowns();
  }

  selectPermission(p: any) {
    this.selectedPermissionName = p.permissionName;
    this.isPermissionDropdownOpen = false;
    this.userForm.patchValue({
      permissionId: p.permissionId,
    });
    this.closeAllDropdowns();
  }

  // =========================
  // LOAD DATA
  // =========================
  loadUsers() {
    this.http.get<any[]>(this.userApi).subscribe({
      next: (res) => {
        this.users = res || [];
        this.filteredUsers = this.users;
        this.cdr.detectChanges();
        console.log('USERS FROM API:', res);
      },
      error: (err) => {
        console.error('User load error', err);

        this.showAlert('error', 'Error', 'Failed to load users');
      },
    });
  }

  loadOrganizations() {
    this.http.get<any[]>(this.orgApi).subscribe({
      next: (res) => {
        this.organizations = res || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);

        this.showAlert('error', 'Error', 'Failed to load organizations');
      },
    });
  }

  loadPermissions() {
    this.http.get<any[]>(this.permissionApi).subscribe({
      next: (res) => {
        this.permissions = res || [];

        // ✅ only sync if form already has value
        const current = this.userForm?.value?.permissionId;

        if (current != null) {
          this.selectedPermissionName =
            this.permissions.find((p) => p.permissionId === current)?.permissionName || '';
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }
  loadBranches() {
    this.http.get<any[]>(this.branchApi).subscribe({
      next: (res) => {
        this.branches = res || [];

        this.filteredBranches = this.branches;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);

        this.showAlert('error', 'Error', 'Failed to load branches');
      },
    });
  }

  loadRoles() {
    this.http.get<any[]>(this.roleApi).subscribe({
      next: (res) => {
        console.log('🔥 Roles:', res); // debug
        this.roles = res || [];
        if (this.isEditMode && this.editId !== null) {
          const current = this.userForm.value.roleId;
          this.selectedRoleName = this.roles.find((r) => r.roleId === current)?.roleName || '';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Role load error', err);

        this.showAlert('error', 'Error', 'Failed to load roles');
      },
    });
  }

  // =========================
  // CLOSE DROPDOWN
  // =========================
  @HostListener('document:click', ['$event'])
  closeDropdown(event: any) {
    if (!event.target.closest('.custom-select-wrapper')) {
      this.closeAllDropdowns();
    }
  }

  // =========================
  // ORGANIZATION
  // =========================
  toggleOrgDropdown(event: Event) {
    event.stopPropagation();

    const isOpen = this.isOrgDropdownOpen;

    this.closeAllDropdowns();

    this.isOrgDropdownOpen = !isOpen;
  }

  selectOrganization(o: any, event: Event) {
    event.stopPropagation();

    this.selectedOrgName = o.organizationName;
    this.userForm.patchValue({ organizationId: o.organizationId });

    // filter branches
    this.filteredBranches = this.branches.filter((b) => b.organizationId === o.organizationId);

    this.selectedBranchName = '';
    this.userForm.patchValue({ branchId: null });

    this.closeAllDropdowns();
  }

  // =========================
  // BRANCH
  // =========================
  toggleBranchDropdown(event?: Event) {
    event?.stopPropagation();

    const isOpen = this.isBranchDropdownOpen;

    this.closeAllDropdowns();

    this.isBranchDropdownOpen = !isOpen;
  }

  selectBranch(b: any, event?: Event) {
    event?.stopPropagation();

    this.selectedBranchName = b.branchName;
    this.userForm.patchValue({ branchId: b.branchId });

    this.closeAllDropdowns();
  }

  loadUserTypes() {
    this.http.get<any[]>(this.userTypeApi).subscribe({
      next: (res) => {
        console.log('🔥 User Types:', res); // debug
        this.userTypes = res || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showAlert('error', 'Error', 'Failed to load user types');
      },
    });
  }

  // =========================
  // ROLE
  // =========================
  toggleUserTypeDropdown(event?: Event) {
    event?.stopPropagation();

    const isOpen = this.isUserTypeDropdownOpen;

    this.closeAllDropdowns();

    this.isUserTypeDropdownOpen = !isOpen;
  }
  selectUserType(r: any, event?: Event) {
    event?.stopPropagation();

    this.selectedUserTypeName = r.typeName;
    this.userForm.patchValue({ userTypeId: r.userTypeId });

    this.isUserTypeDropdownOpen = false;
  }

  // =========================
  // SAVE / UPDATE
  // =========================
  onSubmit() {
    this.userForm.markAllAsTouched();

  if (this.userForm.invalid) {

    const name = this.userForm.get('name');
    const email = this.userForm.get('email');
    const phone = this.userForm.get('phoneNumber');
    const org = this.userForm.get('organizationId');
    const branch = this.userForm.get('branchId');
    const userType = this.userForm.get('userTypeId');
    const role = this.userForm.get('roleId');


    if (name?.hasError('required')) {
      this.showAlert('warning', 'Validation', 'Name is required');
      return;
    }

    if (name?.hasError('pattern')) {
      this.showAlert('warning', 'Validation', 'Name should contain only letters');
      return;
    }


    if (email?.hasError('required')) {
      this.showAlert('warning', 'Validation', 'Email is required');
      return;
    }

    if (email?.hasError('email')) {
      this.showAlert('warning', 'Validation', 'Enter valid email');
      return;
    }


    if (phone?.hasError('required')) {
      this.showAlert('warning', 'Validation', 'Phone Number is required');
      return;
    }

    if (phone?.hasError('pattern')) {
      this.showAlert('warning', 'Validation', 'Phone must be 10 digits');
      return;
    }


    if (org?.invalid) {
      this.showAlert('warning', 'Validation', 'Organization is required');
      return;
    }

    if (branch?.invalid) {
      this.showAlert('warning', 'Validation', 'Branch is required');
      return;
    }

    if (userType?.invalid) {
      this.showAlert('warning', 'Validation', 'User Type is required');
      return;
    }

    if (role?.invalid) {
      this.showAlert('warning', 'Validation', 'Role is required');
      return;
    }

    return;
  }

    // }

    // Existing Save/Update Code

    const payload = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      phoneNumber: this.userForm.value.phoneNumber,
      // password: this.userForm.value.password,
      organizationId: this.userForm.value.organizationId,
      branchId: this.userForm.value.branchId,
      userTypeId: this.userForm.value.userTypeId,
      roleId: this.userForm.value.roleId,
      permissionIds: [1],
    };

    console.log('🔥 Payload:', payload);

    if (this.isEditMode && this.editId !== null) {
      this.http.put(`${this.userApi}/${this.editId}`, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Updated', 'User updated successfully!');

          this.loadUsers();

          this.resetForm();
        },
        error: (err) => {
          console.error('Update error', err);

          this.showAlert('error', 'Error', err?.error || 'Update failed');
        },
      });
    } else {
      this.http.post(this.userApi, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Created', 'User created successfully!');

          this.loadUsers();

          this.resetForm();
        },
        error: (err) => {
          console.error('❌ API Error:', err);

          this.showAlert('error', 'Error', err?.error || 'Create failed');
        },
      });
    }
  }

  // =========================
  // EDIT
  // =========================
  editUser(u: any) {
    this.isEditMode = true;
    this.editId = u.userId;

    this.userForm.patchValue({
      name: u.name,
      email: u.email,
      phoneNumber: u.phoneNumber,
      organizationId: u.organizationId,
      branchId: u.branchId,
      userTypeId: u.userTypeId,
      roleId: u.roleId,
      permissionId: u.permissionId,
    });
    this.selectedRoleName = this.roles.find((x) => x.roleId == u.roleId)?.roleName || '';
    this.selectedOrgName = this.getOrgName(u.organizationId);
    this.selectedBranchName = this.getBranchName(u.branchId);
    this.selectedUserTypeName = this.getUserTypeName(u.userTypeId);
    this.selectedRole = this.getRoleName(u.roleId);

    // 🔥 WAIT until data is loaded
    const wait = setInterval(() => {
      if (this.roles.length > 0 && this.permissions.length > 0) {
        this.selectedRoleName = this.roles.find((r) => r.roleId == u.roleId)?.roleName || '';

        this.selectedPermissionName =
          this.permissions.find((p) => p.permissionId == u.permissionId)?.permissionName || '';

        clearInterval(wait);
      }
    }, 100);
  }

  // =========================
  // DELETE
  // =========================
  deleteUser(id: number) {
    Swal.fire({
      title: 'Delete User?',
      text: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.userApi}/${id}`).subscribe({
          next: () => {
            this.showAlert('success', 'Deleted', 'User deleted successfully!');

            this.loadUsers();
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
    this.userForm.reset();

    this.selectedOrgName = '';
    this.selectedBranchName = '';
    this.selectedUserTypeName = '';
    this.selectedRole = null;
    this.selectedRoleName = '';

    this.selectedRoles = [];
    this.filteredBranches = this.branches;

    this.isEditMode = false;
    this.editId = null;
  }

  // =========================
  // SEARCH
  // =========================
  applySearch() {
    const t = this.searchText.toLowerCase();

    this.filteredUsers = this.users.filter((u) => (u.name || '').toLowerCase().includes(t));
  }

  // =========================
  // LOOKUPS
  // =========================
  getOrgName(id: number) {
    return this.organizations.find((o) => o.organizationId === id)?.organizationName || '';
  }

  getBranchName(id: number) {
    return this.branches.find((b) => b.branchId === id)?.branchName || '';
  }

  getUserTypeName(id: number) {
    return this.userTypes.find((u) => u.userTypeId === id)?.typeName || '';
  }

  getRoleName(id: number) {
    return this.roles.find((r) => r.roleId === id)?.roleName || '';
  }

  closeAllDropdowns() {
    this.isOrgDropdownOpen = false;
    this.isBranchDropdownOpen = false;
    this.isUserTypeDropdownOpen = false;
    this.isRoleDropdownOpen = false;
    this.isPermissionDropdownOpen = false;
  }

  toggleRoleSelection(r: any, event: Event) {
    event.stopPropagation();

    this.selectedRoles = [];

    this.selectedRoles.push(r);

    this.selectedRole = r;

    this.userForm.patchValue({
      roleId: r.roleId,
    });

    this.selectedRoleName = r.roleName;
  }

  isRoleSelected(r: any) {
    return this.userForm.value.roleId === r.roleId;
  }

  removeRole(r: any, event: Event) {
    event.stopPropagation();

    this.selectedRoles = [];

    this.selectedRole = null;

    this.selectedRoleName = '';

    this.userForm.patchValue({
      roleId: null,
    });
  }

  togglePermissionSelection(p: any, event: Event) {
    event.stopPropagation();

    const exists = this.selectedPermissions.find((x) => x.permissionId === p.permissionId);

    if (exists) {
      this.selectedPermissions = this.selectedPermissions.filter(
        (x) => x.permissionId !== p.permissionId,
      );
    } else {
      this.selectedPermissions.push(p);
    }

    this.userForm.patchValue({
      permissionIds: this.selectedPermissions.map((x) => x.permissionId),
    });
  }

  isPermissionSelected(p: any) {
    return this.selectedPermissions.some((x) => x.permissionId === p.permissionId);
  }

  removePermission(p: any, event: Event) {
    event.stopPropagation();
    this.togglePermissionSelection(p, event);
  }

  filteredRoles() {
    return this.roles.filter((r) =>
      r.roleName.toLowerCase().includes(this.roleSearch.toLowerCase()),
    );
  }

  filteredPermissions() {
    return this.permissions.filter((p) =>
      p.permissionName.toLowerCase().includes(this.permissionSearch.toLowerCase()),
    );
  }

  allowOnlyLetters(event: KeyboardEvent) {
    const key = event.key;

    if (!/^[a-zA-Z ]$/.test(key)) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const key = event.key;

    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
    }
  }
}
