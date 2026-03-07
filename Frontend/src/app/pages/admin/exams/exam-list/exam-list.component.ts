import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ExamService, Exam, CreateExamRequest, ExamFilters } from '../../../../core/services/exam.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { CourseService, Course } from '../../../../core/services/course.service';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    ToolbarModule,
    TooltipModule,
    CheckboxModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './exam-list.component.html'
})
export class ExamListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  private examService = inject(ExamService);
  private categoryService = inject(CategoryService);
  private courseService = inject(CourseService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  exams: Exam[] = [];
  categories: Category[] = [];
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  loading = false;
  saving = false;
  examDialog = false;
  isEditMode = false;

  // Pagination
  totalRecords = 0;
  rows = 10;
  first = 0;

  // Filters
  selectedCategoryId: string | null = null;
  selectedType: string | null = null;

  // Form data
  exam: any = {};
  availableQuestions = 0;

  typeOptions = [
    { label: 'Tất cả', value: null },
    { label: 'Luyện tập', value: 'PRACTICE' },
    { label: 'Thi thử', value: 'MOCK_EXAM' },
    { label: 'Thi chính thức', value: 'OFFICIAL' }
  ];

  typeFormOptions = [
    { label: 'Luyện tập', value: 'PRACTICE' },
    { label: 'Thi thử', value: 'MOCK_EXAM' },
    { label: 'Thi chính thức', value: 'OFFICIAL' }
  ];

  ngOnInit(): void {
    this.loadCategories();
    this.loadCourses();
    this.loadExams();
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
          detail: 'Không thể tải danh sách danh mục'
        });
      }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses(1, 100).subscribe({
      next: (result) => {
        this.courses = result.courses;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách khóa học'
        });
      }
    });
  }

  loadExams(): void {
    this.loading = true;
    const page = Math.floor(this.first / this.rows) + 1;

    const filters: ExamFilters = {
      page,
      limit: this.rows,
      categoryId: this.selectedCategoryId || undefined,
      type: this.selectedType || undefined
    };

    this.examService.getExams(filters).subscribe({
      next: (result) => {
        this.exams = result.data;
        this.totalRecords = result.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách bài thi'
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadExams();
  }

  onFilter(): void {
    this.first = 0;
    this.loadExams();
  }

  onFormCategoryChange(): void {
    if (this.exam.categoryId) {
      this.filteredCourses = this.courses.filter((c) => c.categoryId === this.exam.categoryId);
      if (this.exam.courseId && !this.filteredCourses.find((c) => c.id === this.exam.courseId)) {
        this.exam.courseId = null;
      }
    } else {
      this.filteredCourses = [];
      this.exam.courseId = null;
    }
    this.checkAvailableQuestions();
  }

  onFormCourseChange(): void {
    this.checkAvailableQuestions();
  }

  checkAvailableQuestions(): void {
    if (this.exam.categoryId) {
      this.examService.getRandomQuestions(this.exam.categoryId, this.exam.courseId, 1000).subscribe({
        next: (result) => {
          this.availableQuestions = result.totalAvailable;
        },
        error: () => {
          this.availableQuestions = 0;
        }
      });
    } else {
      this.availableQuestions = 0;
    }
  }

  openNew(): void {
    this.exam = {
      title: '',
      description: '',
      categoryId: '',
      courseId: '',
      type: 'PRACTICE',
      duration: 60,
      passingScore: 70,
      questionCount: 20,
      randomize: true,
      isPublic: true,
      isPremium: false,
      instructions: ''
    };
    this.filteredCourses = [];
    this.availableQuestions = 0;
    this.isEditMode = false;
    this.examDialog = true;
  }

  editExam(e: Exam): void {
    this.exam = { ...e };
    if (this.exam.categoryId) {
      this.filteredCourses = this.courses.filter((c) => c.categoryId === this.exam.categoryId);
    }
    this.checkAvailableQuestions();
    this.isEditMode = true;
    this.examDialog = true;
  }

  hideDialog(): void {
    this.examDialog = false;
    this.exam = {};
  }

  saveExam(): void {
    if (!this.exam.title?.trim() || !this.exam.categoryId || !this.exam.questionCount) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
      return;
    }

    if (this.exam.questionCount > this.availableQuestions) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: `Số câu hỏi yêu cầu (${this.exam.questionCount}) vượt quá số câu hỏi có sẵn (${this.availableQuestions})`
      });
      return;
    }

    this.saving = true;

    const request: CreateExamRequest = {
      title: this.exam.title.trim(),
      description: this.exam.description?.trim() || undefined,
      categoryId: this.exam.categoryId,
      courseId: this.exam.courseId || undefined,
      type: this.exam.type,
      duration: this.exam.duration,
      passingScore: this.exam.passingScore,
      questionCount: this.exam.questionCount,
      randomize: this.exam.randomize,
      isPublic: this.exam.isPublic,
      isPremium: this.exam.isPremium,
      instructions: this.exam.instructions?.trim() || undefined
    };

    if (this.isEditMode) {
      this.examService.updateExam(this.exam.id, request).subscribe({
        next: () => {
          this.saving = false;
          this.hideDialog();
          this.loadExams();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật bài thi thành công'
          });
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.error?.error?.message || 'Có lỗi xảy ra'
          });
        }
      });
    } else {
      this.examService.createExam(request).subscribe({
        next: () => {
          this.saving = false;
          this.hideDialog();
          this.loadExams();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tạo bài thi thành công'
          });
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.error?.error?.message || 'Có lỗi xảy ra'
          });
        }
      });
    }
  }

  deleteExam(e: Exam): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa bài thi "${e.title}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.examService.deleteExam(e.id).subscribe({
          next: () => {
            this.loadExams();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa bài thi thành công'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: error.error?.error?.message || 'Không thể xóa bài thi'
            });
          }
        });
      }
    });
  }

  toggleActive(e: Exam): void {
    const newStatus = !e.isActive;
    this.examService.updateExam(e.id, { isActive: newStatus }).subscribe({
      next: () => {
        e.isActive = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đã ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} bài thi`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể cập nhật trạng thái'
        });
      }
    });
  }

  togglePublic(e: Exam): void {
    const newStatus = !e.isPublic;
    this.examService.updateExam(e.id, { isPublic: newStatus }).subscribe({
      next: () => {
        e.isPublic = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đã ${newStatus ? 'công khai' : 'đặt riêng tư'} bài thi`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể cập nhật trạng thái công khai'
        });
      }
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'N/A';
  }

  getCourseName(courseId: string | undefined): string {
    if (!courseId) return 'Tất cả khóa học';
    const course = this.courses.find((c) => c.id === courseId);
    return course ? course.title : 'N/A';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      PRACTICE: 'Luyện tập',
      MOCK_EXAM: 'Thi thử',
      OFFICIAL: 'Chính thức'
    };
    return labels[type] || type;
  }

  getTypeSeverity(type: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
      PRACTICE: 'info',
      MOCK_EXAM: 'warning',
      OFFICIAL: 'success'
    };
    return severityMap[type] || 'secondary';
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}p` : `${hours} giờ`;
  }
}
