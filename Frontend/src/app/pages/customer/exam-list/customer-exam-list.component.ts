import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { ExamTakingService } from '../../../core/services/exam-taking.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { FooterNavComponent } from '../../common-component/footer-nav/footer-nav.component';

interface ExamItem {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  type: string;
  attemptCount: number;
  averageScore?: number;
  category?: { id: string; name: string };
}

@Component({
  selector: 'app-customer-exam-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    TagModule,
    ToastModule,
    SkeletonModule,
    FooterNavComponent,
  ],
  providers: [MessageService],
  templateUrl: './customer-exam-list.component.html',
})
export class CustomerExamListComponent implements OnInit {
  private examService = inject(ExamTakingService);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  exams: ExamItem[] = [];
  categories: Category[] = [];
  loading = true;
  selectedCategoryId: string | null = null;

  // Pagination
  page = 1;
  limit = 10;
  total = 0;
  hasMore = false;

  ngOnInit(): void {
    this.loadCategories();
    this.loadExams();
  }

  loadCategories(): void {
    this.categoryService.getPublicCategories().subscribe({
      next: (data) => {
        this.categories = [{ id: '', name: 'Tất cả danh mục', type: 'OTHER', isActive: true } as any, ...data];
      },
    });
  }

  loadExams(append = false): void {
    if (!append) {
      this.loading = true;
      this.page = 1;
    }

    this.examService.getAvailableExams(this.page, this.limit, this.selectedCategoryId || undefined).subscribe({
      next: (result) => {
        if (append) {
          this.exams = [...this.exams, ...result.data];
        } else {
          this.exams = result.data;
        }
        this.total = result.total;
        this.hasMore = this.exams.length < this.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách đề thi',
        });
      },
    });
  }

  onCategoryChange(): void {
    this.loadExams();
  }

  loadMore(): void {
    this.page++;
    this.loadExams(true);
  }

  startExam(exam: ExamItem): void {
    this.router.navigate(['/exam', exam.id]);
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      PRACTICE: 'Luyện tập',
      MOCK_EXAM: 'Thi thử',
      OFFICIAL: 'Chính thức',
    };
    return labels[type] || type;
  }

  getTypeSeverity(type: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
      PRACTICE: 'info',
      MOCK_EXAM: 'warning',
      OFFICIAL: 'success',
    };
    return severityMap[type] || 'secondary';
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}p` : `${hours} giờ`;
  }

  getCategoryName(exam: ExamItem): string {
    if (exam.category?.name) return exam.category.name;
    const cat = this.categories.find((c) => c.id === exam.categoryId);
    return cat?.name || 'Chưa phân loại';
  }
}
