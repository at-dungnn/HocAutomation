import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AuthenticateService } from 'src/app/core/services';
import { RegisterRequest, UserRole } from 'src/app/shared';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule, PasswordModule, RadioButtonModule],
  templateUrl: './register.component.html'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
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
    this.registerForm = this.fb.group(
      {
        role: ['CUSTOMER' as UserRole, Validators.required],
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/), Validators.minLength(10)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) {
      const fieldLabels: { [key: string]: string } = {
        username: 'tên đăng nhập',
        fullName: 'họ tên',
        email: 'email',
        phone: 'số điện thoại',
        password: 'mật khẩu',
        confirmPassword: 'xác nhận mật khẩu'
      };
      return `Vui lòng nhập ${fieldLabels[fieldName]}`;
    }

    if (errors['email']) return 'Email không hợp lệ';
    if (errors['pattern']) return 'Số điện thoại không hợp lệ';
    if (errors['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      return `Tối thiểu ${minLength} ký tự`;
    }
    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `Tối đa ${maxLength} ký tự`;
    }

    return '';
  }

  getPasswordMismatchError(): string {
    return this.registerForm.errors?.['passwordMismatch'] && this.f['confirmPassword'].touched ? 'Mật khẩu xác nhận không khớp' : '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.registerForm.value;

    const payload: RegisterRequest = {
      username: formValue.username,
      email: formValue.email,
      phone: formValue.phone,
      role: formValue.role,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      name: formValue.fullName
    };

    this.authenticateService.register(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login'], { queryParams: { registered: true } });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.registerForm.setErrors({ serverError: error?.error?.message || error?.message || 'Đăng ký thất bại, vui lòng thử lại.' });
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
