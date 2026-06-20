import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './user-roles.html',
  styleUrls: ['./user-roles.css']
})
export class UserTypeComponent implements OnInit {

  userTypeForm!: FormGroup;

  userTypes: any[] = [];
  filteredUserTypes: any[] = [];

  searchText: string = '';

  isEditMode = false;
  editingId: number | null = null;

  // ORIGINAL VALUES (for update validation like your State page)
  originalTypeName: string | null = null;

  private apiUrl = 'http://localhost:5019/api/UserType';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= INIT =================
  ngOnInit(): void {

    this.userTypeForm = this.fb.group({
      typeName: ['', Validators.required]
    });

    this.loadUserTypes();
  }

  // ================= LOAD =================
  loadUserTypes(): void {

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {

        this.userTypes = res || [];
        this.filteredUserTypes = [...this.userTypes];

        this.applySearch();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= CREATE / UPDATE =================
  onSubmit(): void {

    if (this.userTypeForm.invalid) {

      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'User Type is required',
        showConfirmButton: false
      });

      return;
    }

    const payload = {
      typeName: this.userTypeForm.value.typeName.trim()
    };

    const newName = payload.typeName.toLowerCase();

    // ================= UPDATE =================
    if (this.isEditMode && this.editingId !== null) {

      const oldName = (this.originalTypeName || '').toLowerCase();

      // ❌ NO CHANGE CHECK
      if (newName === oldName) {

        Swal.fire({
          icon: 'warning',
          title: 'No Changes',
          text: 'No changes were made to update!',
          showConfirmButton: false
        });

        return;
      }

      // ❌ DUPLICATE CHECK (UPDATE SAFE)
      const duplicate = this.userTypes.some(x =>
        x.userTypeId !== this.editingId &&
        x.typeName.toLowerCase() === newName
      );

      if (duplicate) {

        Swal.fire({
          icon: 'warning',
          title: 'Duplicate',
          text: 'User Type already exists',
          showConfirmButton: false
        });

        return;
      }

      this.http.put(`${this.apiUrl}/${this.editingId}`, payload)
        .subscribe({
          next: () => {

            Swal.fire({
              icon: 'success',
              title: 'Updated Successfully',
              timer: 2000,
              showConfirmButton: false
            });

            this.afterSave();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
    }

    // ================= CREATE =================
    else {

      const exists = this.userTypes.some(x =>
        x.typeName.toLowerCase() === newName
      );

      if (exists) {

        Swal.fire({
          icon: 'warning',
          title: 'Duplicate',
          text: 'User Type already exists',
          showConfirmButton: false,
          timer: 2000
        });

        return;
      }

      this.http.post(this.apiUrl, payload)
        .subscribe({
          next: () => {

            Swal.fire({
              icon: 'success',
              title: 'Created Successfully',
              timer: 2000,
              showConfirmButton: false
            });

            this.afterSave();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Create Failed',
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
    }
  }

  // ================= AFTER SAVE =================
  afterSave(): void {
    this.loadUserTypes();
    this.resetForm();
    this.cdr.detectChanges();
  }

  // ================= EDIT =================
  editUserType(item: any): void {

    this.isEditMode = true;
    this.editingId = item.userTypeId;

    this.userTypeForm.patchValue({
      typeName: item.typeName
    });

    this.originalTypeName = item.typeName;

    this.cdr.detectChanges();
  }

  // ================= DELETE =================
  deleteUserType(id: number): void {

    Swal.fire({
      title: 'Delete User Type?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      reverseButtons: true
    }).then(result => {

      if (result.isConfirmed) {

        this.http.delete(`${this.apiUrl}/${id}`)
          .subscribe({
            next: () => {

              Swal.fire({
                icon: 'success',
                title: 'Deleted Successfully',
                timer: 2000,
                showConfirmButton: false
              });

              this.loadUserTypes();
              this.cdr.detectChanges();
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                showConfirmButton: false,
                timer: 2000
              });
            }
          });
      }
    });
  }

  // ================= RESET =================
  resetForm(): void {

    this.userTypeForm.reset();

    this.isEditMode = false;
    this.editingId = null;

    this.originalTypeName = null;

    this.cdr.detectChanges();
  }

  // ================= SEARCH =================
  applySearch(): void {

    const term = this.searchText.toLowerCase();

    this.filteredUserTypes = this.userTypes.filter(x =>
      x.typeName.toLowerCase().includes(term)
    );

    this.cdr.detectChanges();
  }

  // ================= VALIDATION =================
  hasError(control: string): boolean {

    const field = this.userTypeForm.get(control);
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