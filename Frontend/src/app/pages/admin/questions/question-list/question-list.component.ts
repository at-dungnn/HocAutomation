import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService, ConfirmationService } from 'primeng/api';
import { QuestionService, Question, CreateQuestionRequest, QuestionFilters, QuestionOption } from '../../../../core/services/question.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { CourseService, Course } from '../../../../core/services/course.service';

@Component({
  selector: 'app-question-list',
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
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    ToolbarModule,
    TooltipModule,
    RadioButtonModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './question-list.component.html',
})
export class QuestionListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  private questionService = inject(QuestionService);
  private categoryService = inject(CategoryService);
  private courseService = inject(CourseService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  questions: Question[] = [];
  categories: Category[] = [];
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  loading = false;
  saving = false;
  questionDialog = false;
  isEditMode = false;

  // Pagination
  totalRecords = 0;
  rows = 10;
  first = 0;

  // Filters
  filters: QuestionFilters = {
    page: 1,
    limit: 10,
  };
  selectedCategoryId: string | null = null;
  selectedDifficulty: string | null = null;

  // Form data
  question: any = {};
  selectedFormCategoryId: string | null = null;

  difficultyOptions = [
    { label: 'Tất cả', value: null },
    { label: 'Dễ', value: 'EASY' },
    { label: 'Trung bình', value: 'MEDIUM' },
    { label: 'Khó', value: 'HARD' },
    { label: 'Chuyên gia', value: 'EXPERT' },
  ];

  difficultyFormOptions = [
    { label: 'Dễ', value: 'EASY' },
    { label: 'Trung bình', value: 'MEDIUM' },
    { label: 'Khó', value: 'HARD' },
    { label: 'Chuyên gia', value: 'EXPERT' },
  ];

  ngOnInit(): void {
    this.loadCategories();
    this.loadCourses();
    this.loadQuestions();
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
    this.courseService.getCourses(1, 100).subscribe({
      next: (result) => {
        this.courses = result.courses;
        this.filteredCourses = this.courses;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách khóa học',
        });
      },
    });
  }

  loadQuestions(): void {
    this.loading = true;
    const page = Math.floor(this.first / this.rows) + 1;

    const filters: QuestionFilters = {
      page,
      limit: this.rows,
      categoryId: this.selectedCategoryId || undefined,
      difficulty: this.selectedDifficulty || undefined,
    };

    this.questionService.getQuestions(filters).subscribe({
      next: (result) => {
        this.questions = result.data;
        this.totalRecords = result.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách câu hỏi',
        });
      },
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadQuestions();
  }

  onFilter(): void {
    this.first = 0;
    this.loadQuestions();
  }

  onFormCategoryChange(): void {
    // Filter courses by selected category
    if (this.question.categoryId) {
      this.filteredCourses = this.courses.filter((c) => c.categoryId === this.question.categoryId);
      // Reset courseId if not in filtered list
      if (this.question.courseId && !this.filteredCourses.find((c) => c.id === this.question.courseId)) {
        this.question.courseId = null;
      }
    } else {
      this.filteredCourses = [];
      this.question.courseId = null;
    }
  }

  openNew(): void {
    this.question = {
      content: '',
      categoryId: '',
      courseId: '',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      points: 1,
      explanation: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: '1',
      tags: [],
    };
    this.filteredCourses = [];
    this.isEditMode = false;
    this.questionDialog = true;
  }

  editQuestion(q: Question): void {
    // Convert options array to individual fields
    const options = q.options || [];
    this.question = {
      ...q,
      option1: options[0]?.text || '',
      option2: options[1]?.text || '',
      option3: options[2]?.text || '',
      option4: options[3]?.text || '',
      correctAnswer: this.getCorrectAnswerIndex(options),
    };
    // Filter courses for the selected category
    if (this.question.categoryId) {
      this.filteredCourses = this.courses.filter((c) => c.categoryId === this.question.categoryId);
    } else {
      this.filteredCourses = [];
    }
    this.isEditMode = true;
    this.questionDialog = true;
  }

  getCorrectAnswerIndex(options: QuestionOption[]): string {
    const index = options.findIndex((o) => o.isCorrect);
    return index >= 0 ? (index + 1).toString() : '1';
  }

  hideDialog(): void {
    this.questionDialog = false;
    this.question = {};
  }

  saveQuestion(): void {
    if (!this.question.content?.trim() || !this.question.categoryId || !this.question.courseId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng chọn Danh mục, Khóa học và nhập nội dung câu hỏi',
      });
      return;
    }

    // Validate options for multiple choice
    if (this.question.type === 'MULTIPLE_CHOICE') {
      if (!this.question.option1?.trim() || !this.question.option2?.trim()) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: 'Câu hỏi trắc nghiệm cần ít nhất 2 đáp án',
        });
        return;
      }
    }

    this.saving = true;

    // Build options array
    const options: QuestionOption[] = [];
    const correctIndex = parseInt(this.question.correctAnswer, 10) - 1;

    if (this.question.option1?.trim()) {
      options.push({ id: '1', text: this.question.option1.trim(), isCorrect: correctIndex === 0 });
    }
    if (this.question.option2?.trim()) {
      options.push({ id: '2', text: this.question.option2.trim(), isCorrect: correctIndex === 1 });
    }
    if (this.question.option3?.trim()) {
      options.push({ id: '3', text: this.question.option3.trim(), isCorrect: correctIndex === 2 });
    }
    if (this.question.option4?.trim()) {
      options.push({ id: '4', text: this.question.option4.trim(), isCorrect: correctIndex === 3 });
    }

    const request: CreateQuestionRequest = {
      categoryId: this.question.categoryId,
      courseId: this.question.courseId,
      content: this.question.content.trim(),
      type: this.question.type || 'MULTIPLE_CHOICE',
      difficulty: this.question.difficulty || 'MEDIUM',
      options,
      explanation: this.question.explanation?.trim() || undefined,
      points: this.question.points || 1,
      tags: this.question.tags || [],
    };

    if (this.isEditMode) {
      this.questionService.updateQuestion(this.question.id, request).subscribe({
        next: () => {
          this.saving = false;
          this.hideDialog();
          this.loadQuestions();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật câu hỏi thành công',
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
      this.questionService.createQuestion(request).subscribe({
        next: () => {
          this.saving = false;
          this.hideDialog();
          this.loadQuestions();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm câu hỏi thành công',
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

  deleteQuestion(q: Question): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa câu hỏi này?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.questionService.deleteQuestion(q.id).subscribe({
          next: () => {
            this.loadQuestions();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa câu hỏi thành công',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: error.error?.error?.message || 'Không thể xóa câu hỏi',
            });
          },
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

  getDifficultyLabel(difficulty: string): string {
    const labels: { [key: string]: string } = {
      EASY: 'Dễ',
      MEDIUM: 'Trung bình',
      HARD: 'Khó',
      EXPERT: 'Chuyên gia',
    };
    return labels[difficulty] || difficulty;
  }

  getDifficultySeverity(difficulty: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
      EASY: 'success',
      MEDIUM: 'info',
      HARD: 'warning',
      EXPERT: 'danger',
    };
    return severityMap[difficulty] || 'secondary';
  }

  getOptionText(options: QuestionOption[] | undefined, index: number): string {
    if (!options || !options[index]) return '';
    return options[index].text;
  }

  getCorrectAnswerText(options: QuestionOption[] | undefined): string {
    if (!options) return 'N/A';
    const correct = options.find((o) => o.isCorrect);
    if (!correct) return 'N/A';
    const index = options.indexOf(correct) + 1;
    return `${index}`;
  }

  truncateText(text: string, maxLength: number = 50): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
