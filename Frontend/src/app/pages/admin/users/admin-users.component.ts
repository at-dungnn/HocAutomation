import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthUser, UserRole } from 'src/app/shared/models/user-auth.model';
import { AdminService } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DropdownModule, DialogModule, TagModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: AuthUser[] = [];
  displayDialog = false;
  userForm!: FormGroup;
  isEditMode = false;
  loading = false;

  roles = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Khách hàng', value: 'CUSTOMER' },
    { label: 'Shipper', value: 'SHIPPER' },
    { label: 'Nhà cung cấp', value: 'PROVIDER' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      role: ['CUSTOMER', Validators.required]
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách người dùng'
        });
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.userForm.reset({ role: 'CUSTOMER' });
    this.displayDialog = true;
  }

  editUser(user: AuthUser): void {
    this.isEditMode = true;
    this.userForm.patchValue(user);
    this.displayDialog = true;
  }

  deleteUser(user: AuthUser): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa người dùng ${user.name}?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      accept: () => {
        this.adminService.deleteUser(user.id).subscribe({
          next: () => {
            this.users = this.users.filter((u) => u.id !== user.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã xóa người dùng'
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể xóa người dùng'
            });
          }
        });
      }
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    const userData = this.userForm.value;

    if (this.isEditMode) {
      // TODO: Call API to update user
      const index = this.users.findIndex((u) => u.id === userData.id);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...userData };
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã cập nhật người dùng'
      });
    } else {
      // TODO: Call API to create user
      const newUser: AuthUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.users = [...this.users, newUser];
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã thêm người dùng mới'
      });
    }

    this.displayDialog = false;
  }

  getRoleSeverity(role: UserRole): string {
    const severityMap: Record<UserRole, string> = {
      ADMIN: 'danger',
      CUSTOMER: 'info',
      SHIPPER: 'success',
      PROVIDER: 'warning'
    };
    return severityMap[role] || 'info';
  }

  getRoleLabel(role: UserRole): string {
    const labelMap: Record<UserRole, string> = {
      ADMIN: 'Admin',
      CUSTOMER: 'Khách hàng',
      SHIPPER: 'Shipper',
      PROVIDER: 'Nhà cung cấp'
    };
    return labelMap[role] || role;
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
