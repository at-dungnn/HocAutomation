import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ExamTakingService, ExamAttempt } from '../../../core/services/exam-taking.service';
import { FooterNavComponent } from '../../common-component/footer-nav/footer-nav.component';

@Component({
  selector: 'app-exam-history',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TagModule, ToastModule, SkeletonModule, TooltipModule, FooterNavComponent],
  providers: [MessageService],
  templateUrl: './exam-history.component.html'
})
export class ExamHistoryComponent implements OnInit {
  private examService = inject(ExamTakingService);
  private messageService = inject(MessageService);

  attempts: ExamAttempt[] = [];
  loading = true;

  // Pagination
  page = 1;
  limit = 10;
  total = 0;
  hasMore = false;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(append = false): void {
    if (!append) {
      this.loading = true;
      this.page = 1;
    }

    this.examService.getMyExamHistory(this.page, this.limit).subscribe({
      next: (result) => {
        if (append) {
          this.attempts = [...this.attempts, ...result.data];
        } else {
          this.attempts = result.data;
        }
        this.total = result.total;
        this.hasMore = this.attempts.length < this.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải lịch sử thi'
        });
      }
    });
  }

  loadMore(): void {
    this.page++;
    this.loadHistory(true);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      IN_PROGRESS: 'Đang làm',
      COMPLETED: 'Hoàn thành',
      ABANDONED: 'Bỏ dở',
      EXPIRED: 'Hết giờ'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
      IN_PROGRESS: 'warning',
      COMPLETED: 'success',
      ABANDONED: 'secondary',
      EXPIRED: 'danger'
    };
    return severityMap[status] || 'secondary';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTimeSpent(seconds?: number): string {
    if (!seconds) return '--';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}p ${secs}s`;
  }
}
