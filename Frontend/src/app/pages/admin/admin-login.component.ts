import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthenticateService } from 'src/app/core/services';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authenticateService: AuthenticateService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
      next: (response) => {
        this.isSubmitting = false;

        // Kiểm tra role ADMIN
        if (response.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.loginForm.setErrors({
            serverError: 'Bạn không có quyền truy cập khu vực quản lý'
          });
          this.sessionService.destroySession();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.loginForm.setErrors({
          serverError: error?.error?.message || error?.message || 'Đăng nhập thất bại'
        });
      }
    });
  }

  goToLanding(): void {
    this.router.navigate(['/']);
  }
}
