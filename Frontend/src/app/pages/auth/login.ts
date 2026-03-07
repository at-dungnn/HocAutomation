import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthenticateService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FloatLabelModule],
  templateUrl: './login.component.html'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authenticateService: AuthenticateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return fieldName === 'phone' ? 'Vui lòng nhập số điện thoại' : 'Vui lòng nhập mật khẩu';
    }
    if (control.errors['pattern']) {
      return 'Số điện thoại không hợp lệ';
    }
    if (control.errors['minlength']) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const { phone, password } = this.loginForm.value;

    this.authenticateService.login(phone, password).subscribe({
      next: (authResponse) => {
        this.isSubmitting = false;
        
        // Redirect based on user role
        const userRole = authResponse.user.role;
        
        if (userRole === 'ADMIN') {
          // Admin goes to admin dashboard
          this.router.navigate(['/admin']);
        } else if (userRole === 'INSTRUCTOR') {
          // Instructor goes to instructor dashboard
          this.router.navigate(['/instructor']);
        } else if (userRole === 'CUSTOMER') {
          // Customer/Student goes to main dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Default fallback
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.loginForm.setErrors({ serverError: error?.error?.message || error?.message || 'Đăng nhập thất bại' });
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
