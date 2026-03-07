import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { Article } from '../../../../core/services/article.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    DialogModule
  ],
  templateUrl: './article-form.component.html'
})
export class ArticleFormComponent implements OnInit {
  @Input() visible = false;
  @Input() article: Article | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  articleForm!: FormGroup;
  isSubmitting = false;

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.article && this.articleForm) {
      this.articleForm.patchValue({
        title: this.article.title,
        excerpt: this.article.excerpt,
        content: this.article.content,
        type: this.article.type,
        status: this.article.status
      });
    } else if (this.articleForm) {
      this.articleForm.reset({
        title: '',
        excerpt: '',
        content: '',
        type: 'NEWS',
        status: 'DRAFT'
      });
    }
  }

  private initForm(): void {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      excerpt: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      type: ['NEWS', Validators.required],
      status: ['DRAFT', Validators.required]
    });

    // Load article data if editing
    if (this.article) {
      this.articleForm.patchValue({
        title: this.article.title,
        excerpt: this.article.excerpt,
        content: this.article.content,
        type: this.article.type,
        status: this.article.status
      });
    }
  }

  get f() {
    return this.articleForm.controls;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.articleForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) {
      const fieldLabels: { [key: string]: string } = {
        title: 'tiêu đề',
        excerpt: 'tóm tắt',
        content: 'nội dung',
        type: 'loại bài viết',
        status: 'trạng thái'
      };
      return `Vui lòng nhập ${fieldLabels[fieldName]}`;
    }

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

  onSubmit(): void {
    if (this.articleForm.invalid) {
      Object.keys(this.articleForm.controls).forEach((key) => {
        this.articleForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.save.emit(this.articleForm.value);
  }

  onCancel(): void {
    this.articleForm.reset({
      title: '',
      excerpt: '',
      content: '',
      type: 'NEWS',
      status: 'DRAFT'
    });
    this.visibleChange.emit(false);
  }

  resetSubmitting(): void {
    this.isSubmitting = false;
  }
}
