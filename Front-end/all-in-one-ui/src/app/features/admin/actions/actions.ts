import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './actions.html',
  styleUrl: './actions.css'
})
export class ActionComponent implements OnInit {

  // ================= FORM =================
  actionForm!: FormGroup;

  // ================= DATA =================
  actions: any[] = [];
  filteredActions: any[] = [];

  // ================= UI =================
  searchText = '';
  isEditMode = false;
  editId: number | null = null;

  // ================= TRACK ORIGINAL =================
  originalAction: any = null;

  // ================= API =================
  private apiUrl = 'http://localhost:5019/api/Action';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.actionForm = this.fb.group({
      actionTitle: ['', Validators.required],
      actionDescription: ['', Validators.required]
    });

    this.loadActions();
  }

  // ================= ALERT =================
  showAlert(icon: 'success' | 'error' | 'warning', title: string, text: string) {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#2563eb',
      timer: 2500,
      showConfirmButton: false
    });
  }

  // ================= LOAD =================
  loadActions() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.actions = res || [];
        this.filteredActions = [...this.actions];
        this.cdr.detectChanges();
      },
      error: () => {
        this.showAlert('error', 'Error', 'Unable to load actions');
      }
    });
  }

  // ================= VALIDATION HELPER =================
  hasError(controlName: string): boolean {
    const control = this.actionForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  // ================= DUPLICATE CHECK =================
  isDuplicate(title: string): boolean {
    const value = (title || '').trim().toLowerCase();

    return this.actions.some(a => {
      if (this.isEditMode && a.actionId === this.editId) return false;
      return (a.actionTitle || '').trim().toLowerCase() === value;
    });
  }

  // ================= SUBMIT =================
  onSubmit() {

    if (this.actionForm.value.actionTitle.trim() === '' && this.actionForm.value.actionDescription.trim() === '') {
      this.actionForm.markAllAsTouched();
      this.showAlert('warning', 'Validation', 'Please fill all required fields');
      return;
    }

    if( this.actionForm.value.actionTitle.trim() === '') {
      // this.actionForm.get('actionTitle')?.markAsTouched();
      this.showAlert('warning', 'Validation', 'Action Title is required');
      return;
    }
    
    if( this.actionForm.value.actionDescription.trim() === '') {
      // this.actionForm.get('actionDescription')?.markAsTouched();
      this.showAlert('warning', 'Validation', 'Action Description is required');
      return;
    }

    const title = this.actionForm.value.actionTitle.trim();
    const description = this.actionForm.value.actionDescription.trim();

    if (this.isDuplicate(title)) {
      this.showAlert('warning', 'Duplicate', 'Action already exists');
      return;
    }

    const payload = {
      actionTitle: title,
      actionDescription: description
    };

    // ================= UPDATE =================
    if (this.isEditMode) {

      const oldTitle = this.originalAction?.actionTitle?.trim() ?? '';
      const oldDescription = this.originalAction?.actionDescription?.trim() ?? '';

      if (oldTitle === title && oldDescription === description) {
        this.showAlert('warning', 'No Changes', 'Nothing was changed');
        return;
      }

      this.http.put(`${this.apiUrl}/${this.editId}`, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Updated', 'Action updated successfully');
          this.loadActions();
          this.resetForm();
        },
        error: () => {
          this.showAlert('error', 'Error', 'Update failed');
        }
      });
    }

    // ================= CREATE =================
    else {
      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          this.showAlert('success', 'Created', 'Action created successfully');
          this.loadActions();
          this.resetForm();
        },
        error: () => {
          this.showAlert('error', 'Error', 'Create failed');
        }
      });
    }
  }

  // ================= EDIT =================
  editAction(action: any) {
    this.isEditMode = true;
    this.editId = action.actionId;

    this.originalAction = {
      actionTitle: action.actionTitle,
      actionDescription: action.actionDescription
    };

    this.actionForm.patchValue({
      actionTitle: action.actionTitle,
      actionDescription: action.actionDescription
    });
  }

  // ================= DELETE =================
  deleteAction(id: number) {
    Swal.fire({
      title: 'Delete Action?',
      text: 'This action will be removed permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
          next: () => {
            this.showAlert('success', 'Deleted', 'Action removed successfully');
            this.loadActions();
          },
          error: () => {
            this.showAlert('error', 'Error', 'Delete failed');
          }
        });
      }
    });
  }

  // ================= RESET =================
  resetForm() {
    this.actionForm.reset({
      actionTitle: '',
      actionDescription: ''
    });

    this.isEditMode = false;
    this.editId = null;
    this.originalAction = null;
  }

  // ================= SEARCH =================
  applySearch() {
    const term = (this.searchText || '').toLowerCase();

    this.filteredActions = this.actions.filter(a =>
      (a.actionTitle || '').toLowerCase().includes(term)
    );
  }

  allowOnlyLetters(event: KeyboardEvent): void {
  const char = event.key;

  // Allow only letters and spaces
  if (!/^[a-zA-Z ]$/.test(char)) {
    event.preventDefault();
  }
}
}