import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CategoryService, Category, CreateCategoryRequest } from '../../../../core/services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    ToolbarModule,
    ToggleButtonModule,
    TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  categories: Category[] = [];
  category: any = {};
  loading = false;
  saving = false;
  categoryDialog = false;
  isEditMode = false;

  categoryTypes = [
    { label: 'Pháp luật', value: 'LAW' },
    { label: 'Ngân hàng', value: 'BANKING' },
    { label: 'Hành chính công', value: 'PUBLIC_ADMINISTRATION' },
    { label: 'Kiến thức chung', value: 'GENERAL_KNOWLEDGE' },
    { label: 'Tiếng Anh', value: 'ENGLISH' },
    { label: 'Tin học', value: 'IT' },
    { label: 'Khác', value: 'OTHER' },
  ];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách danh mục',
        });
      },
    });
  }

  openNew(): void {
    this.category = {
      name: '',
      type: '',
      description: '',
      order: 0,
      isActive: true,
    };
    this.isEditMode = false;
    this.categoryDialog = true;
  }

  editCategory(category: Category): void {
    this.category = { ...category };
    this.isEditMode = true;
    this.categoryDialog = true;
  }

  hideDialog(): void {
    this.categoryDialog = false;
    this.category = {};
  }

  saveCategory(): void {
    if (!this.category.name?.trim() || !this.category.type) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      });
      return;
    }

    this.saving = true;

    const request: CreateCategoryRequest = {
      name: this.category.name.trim(),
      type: this.category.type,
      description: this.category.description?.trim() || '',
      order: this.category.order || 0,
    };

    if (this.isEditMode) {
      this.categoryService.updateCategory(this.category.id, {
        ...request,
        isActive: this.category.isActive,
      } as any).subscribe({
        next: () => {
          this.saving = false;
          this.hideDialog();
          this.loadCategories();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật danh mục thành công',
          });
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.error?.error?.message || error.error?.message || 'Có lỗi xảy ra',
          });
        },
      });
    } else {
      this.categoryService.createCategory(request).subscribe({
        next: () => {
          this.saving = false;
          this.hideDialog();
          this.loadCategories();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm danh mục thành công',
          });
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.error?.error?.message || error.error?.message || 'Có lỗi xảy ra',
          });
        },
      });
    }
  }

  deleteCategory(category: Category): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.loadCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa danh mục thành công',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: error.error?.error?.message || error.error?.message || 'Không thể xóa danh mục',
            });
          },
        });
      },
    });
  }

  toggleStatus(category: Category): void {
    const newStatus = !category.isActive;
    this.categoryService.updateCategory(category.id, { isActive: newStatus } as any).subscribe({
      next: () => {
        category.isActive = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đã ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} danh mục`,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: error.error?.error?.message || 'Không thể cập nhật trạng thái',
        });
      },
    });
  }

  onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'contains');
  }

  getCategoryTypeLabel(type: string): string {
    const found = this.categoryTypes.find((t) => t.value === type);
    return found ? found.label : type;
  }

  getCategoryTypeSeverity(type: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
      LAW: 'info',
      BANKING: 'success',
      PUBLIC_ADMINISTRATION: 'warning',
      GENERAL_KNOWLEDGE: 'secondary',
      ENGLISH: 'info',
      IT: 'contrast',
      OTHER: 'secondary',
    };
    return severityMap[type] || 'secondary';
  }
}
