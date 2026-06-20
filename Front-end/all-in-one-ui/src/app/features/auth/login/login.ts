import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  isPasswordFocused = false;
  isMascotActive = false;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      organizationCode: ['AIO001', Validators.required],
      email: ['admin@allinone.com', [Validators.required, Validators.email]],
      password: ['Admin@123', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.isMascotActive = true;
  }

  onPasswordFocus() {
    this.isPasswordFocused = true;
    this.isMascotActive = true;
  }

  onPasswordBlur() {
    this.isPasswordFocused = false;
  }

  onLogin() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;

    const payload: LoginRequest = {
      organizationCode: this.loginForm.value.organizationCode,
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          this.errorMessage = '';
          this.successMessage = 'Login successful! Redirecting...';
          if (response.token) {
            localStorage.setItem('token', response.token);
          }

          localStorage.setItem('userName', response.userName || '');
          localStorage.setItem('role', response.role || '');

           this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/welcome']);
          }, 1200);
        } else {
          this.errorMessage = response.message || 'Invalid login credentials';
        }
      },
      error: (error) => {
      this.isLoading = false;
      console.error('Login Error:', error);

      if (error.status === 401) {
        this.errorMessage = 'Invalid email, password, or organization code.';
      } else if (error.status === 400) {
        this.errorMessage = 'Invalid request. Please check your input.';
      } else if (error.status === 500) {
        this.errorMessage = 'Server error. Please try again later.';
      } else if (error.status === 0) {
        this.errorMessage = 'Unable to connect to server.';
      } else {
        this.errorMessage = 'Login failed. Please try again.';
      }
      console.log('Error Message Set:', this.errorMessage);
       this.cdr.detectChanges();
    }
  });
  }
}