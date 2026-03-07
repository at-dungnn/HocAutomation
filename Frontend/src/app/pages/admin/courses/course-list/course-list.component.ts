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
import { CourseService, Course, CreateCourseRequest } from '../../../../core/services/course.service';
import { CategoryService, Category } from '../../../../core/services/category.service';

@Component({
  selector: 'app-course-list',
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
  templateUrl: './course-list.component.html',
})
export class CourseListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  private courseService = inject(CourseService);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  courses: Course[] = [];
  categories: Category[] = [];
  course: any = {};
  loading = false;
  saving = false;
  courseDialog = false;
  isEditMode = false;

  // Pagination
  totalRecords = 0;
  rows = 10;
  first = 0;

  // Filter
  selectedCategoryId: string | null = null;
  selectedStatus: string | null = null;

  statusOptions = [
    { label: 'Tất cả', value: null },
    { label: 'Nháp', value: 'DRAFT' },
    { label: 'Đã xuất bản', value: 'PUBLISHED' },
    { label: 'Lưu trữ', value: 'ARCHIVED' },
  ];

  levelOptions = [
    { label: 'Cơ bản', value: 'BEGINNER' },
    { label: 'Trung bình', value: 'INTERMEDIATE' },
    { label: 'Nâng cao', value: 'ADVANCED' },
    { label: 'Chuyên gia', value: 'EXPERT' },
  ];

  ngOnInit(): void {
    this.loadCategories();
    this.loadCourses();
  }

  loadCategories(): void {
    this.categoryService.getCategories(true).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách danh mục',
        });
      },
    });
  }

  loadCourses(): void {
    this.loading = true;
    const page = Math.floor(this.first / this.rows) + 1;

    this.courseService
      .getCourses(page, this.rows, this.selectedCategoryId || undefined, this.selectedStatus || undefined)
      .subscribe({
        next: (result) => {
          this.courses = result.courses;
          this.totalRecords = result.pagination?.total || 0;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải danh sách khóa học',
          });
        },
      });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadCourses();
  }

  onFilter(): void {
    this.first = 0;
    this.loadCourses();
  }

  openNew(): void {
    this.course = {
      title: '',
      description: '',
      categoryId: '',
      price: 0,
      discountPrice: null,
      duration: null,
      level: 'BEGINNER',
      isPublished: false,
    };
    this.isEditMode = false;
    this.courseDialog = true;
  }

  editCourse(course: Course): void {
    this.course = { ...course };
    this.isEditMode = true;
    this.courseDialog = true;
  }

  hideDialog(): void {
    this.courseDialog = false;
    this.course = {};
  }

  saveCourse(): void {
    if (!this.course.title?.trim() || !this.course.categoryId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      });
      return;
    }

    this.saving = true;

    const request: CreateCourseRequest = {
      title: this.course.title.trim(),
      description: this.course.description?.trim() || '',
      categoryId: this.course.categoryId,
      price: this.course.price || 0,
      discountPrice: this.course.discountPrice || undefined,
      duration: this.course.duration || undefined,
      level: this.course.level || 'BEGINNER',
    };

    if (this.isEditMode) {
      this.courseService
        .updateCourse(this.course.id, {
          ...request,
          status: this.course.status,
          isPublished: this.course.isPublished,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.hideDialog();
            this.loadCourses();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật khóa học thành công',
            });
          },
          error: (error) => {
            this.saving = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: error.error?.error?.message || 'Có lỗi xảy ra',
            });
          },
        });
    } else {
      this.courseService.createCourse(request).subscribe({
        next: () => {
          this.saving = false;
          this.hideDialog();
          this.loadCourses();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm khóa học thành công',
          });
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.error?.error?.message || 'Có lỗi xảy ra',
          });
        },
      });
    }
  }

  deleteCourse(course: Course): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa khóa học "${course.title}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.courseService.deleteCourse(course.id).subscribe({
          next: () => {
            this.loadCourses();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa khóa học thành công',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: error.error?.error?.message || 'Không thể xóa khóa học',
            });
          },
        });
      },
    });
  }

  togglePublish(course: Course): void {
    const newStatus = !course.isPublished;
    this.courseService.updateCourse(course.id, { isPublished: newStatus }).subscribe({
      next: () => {
        course.isPublished = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đã ${newStatus ? 'xuất bản' : 'hủy xuất bản'} khóa học`,
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

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'N/A';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      DRAFT: 'Nháp',
      PUBLISHED: 'Đã xuất bản',
      ARCHIVED: 'Lưu trữ',
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
      DRAFT: 'warning',
      PUBLISHED: 'success',
      ARCHIVED: 'secondary',
    };
    return severityMap[status] || 'secondary';
  }

  getLevelLabel(level: string): string {
    const found = this.levelOptions.find((l) => l.value === level);
    return found ? found.label : level || 'N/A';
  }

  formatPrice(price: number): string {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
