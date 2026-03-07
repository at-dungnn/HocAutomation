import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ArticleService, Article, ArticleType, ArticleStatus } from '../../../../core/services/article.service';
import { ArticleFormComponent } from '../article-form/article-form.component';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    TooltipModule,
    ArticleFormComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnInit {
  @ViewChild(ArticleFormComponent) articleFormComponent?: ArticleFormComponent;

  private articleService = inject(ArticleService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  articles: Article[] = [];
  loading = false;
  totalRecords = 0;

  filters = {
    page: 1,
    limit: 10,
    search: '',
    type: null as ArticleType | null,
    status: null as ArticleStatus | null
  };

  articleTypes = [
    { label: 'Tin tức', value: 'NEWS' },
    { label: 'Tin nóng', value: 'HOT_NEWS' },
    { label: 'Mẹo học tập', value: 'STUDY_TIPS' },
    { label: 'Kinh nghiệm', value: 'EXPERIENCE' },
    { label: 'Thông báo', value: 'ANNOUNCEMENT' }
  ];

  statusOptions = [
    { label: 'Nháp', value: 'DRAFT' },
    { label: 'Đã xuất bản', value: 'PUBLISHED' },
    { label: 'Lưu trữ', value: 'ARCHIVED' }
  ];

  displayDialog = false;
  editingArticle: Article | null = null;

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles(event?: any) {
    if (event) {
      this.filters.page = Math.floor(event.first / event.rows) + 1;
      this.filters.limit = event.rows;
    }

    this.loading = true;
    this.articleService.getAllArticles({
      page: this.filters.page,
      limit: this.filters.limit,
      search: this.filters.search || undefined,
      type: this.filters.type || undefined,
      status: this.filters.status || undefined
    }).subscribe({
      next: (response) => {
        this.articles = response.articles;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: error.message || 'Không thể tải danh sách bài viết'
        });
      }
    });
  }

  onFilterChange() {
    this.filters.page = 1;
    this.loadArticles();
  }

  openDialog(article?: Article) {
    this.editingArticle = article || null;
    this.displayDialog = true;
  }

  saveArticle(formData: any) {
    const request = this.editingArticle
      ? this.articleService.updateArticle(this.editingArticle.id, formData)
      : this.articleService.createArticle(formData);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Bài viết đã ${this.editingArticle ? 'cập nhật' : 'tạo'} thành công`
        });
        this.displayDialog = false;
        this.editingArticle = null;
        this.loadArticles();
        this.articleFormComponent?.resetSubmitting();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: error.message || `Không thể ${this.editingArticle ? 'cập nhật' : 'tạo'} bài viết`
        });
        this.articleFormComponent?.resetSubmitting();
      }
    });
  }

  confirmDelete(article: Article) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bài viết này?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.articleService.deleteArticle(article.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Bài viết đã xóa thành công'
            });
            this.loadArticles();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: error.message || 'Không thể xóa bài viết'
            });
          }
        });
      }
    });
  }

  getTypeLabel(type: ArticleType): string {
    const typeObj = this.articleTypes.find(t => t.value === type);
    return typeObj?.label || type;
  }

  getStatusLabel(status: ArticleStatus): string {
    const statusObj = this.statusOptions.find(s => s.value === status);
    return statusObj?.label || status;
  }

  getStatusSeverity(status: ArticleStatus): 'success' | 'warning' | 'info' {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'info';
      default:
        return 'info';
    }
  }
}
