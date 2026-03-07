import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { interval, Subscription } from 'rxjs';
import {
  ExamTakingService,
  ExamQuestion,
  ExamInfo,
  StartExamResponse,
  SubmitAnswer,
  ExamResult,
} from '../../../core/services/exam-taking.service';

@Component({
  selector: 'app-exam-taking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    RadioButtonModule,
    DialogModule,
    ToastModule,
    ProgressBarModule,
    TagModule,
  ],
  providers: [MessageService],
  templateUrl: './exam-taking.component.html',
})
export class ExamTakingComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamTakingService);
  private messageService = inject(MessageService);

  // Exam state
  examId: string = '';
  attemptId: string = '';
  exam: ExamInfo | null = null;
  questions: ExamQuestion[] = [];
  answers: { [questionId: string]: string } = {};

  // UI state
  loading = true;
  submitting = false;
  currentQuestionIndex = 0;
  showConfirmSubmit = false;
  showResult = false;
  result: ExamResult | null = null;

  // Timer
  startedAt: Date | null = null;
  remainingSeconds = 0;
  timerSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    if (this.examId) {
      this.startExam();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startExam(): void {
    this.loading = true;
    this.examService.startExam(this.examId).subscribe({
      next: (response: StartExamResponse) => {
        this.attemptId = response.attemptId;
        this.exam = response.exam;
        this.questions = response.questions;
        this.startedAt = new Date(response.startedAt);
        this.remainingSeconds = this.exam.duration * 60;

        // Initialize answers
        this.questions.forEach((q) => {
          this.answers[q.id] = '';
        });

        this.loading = false;
        this.startTimer();
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: error.error?.error?.message || 'Không thể bắt đầu bài thi',
        });
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
    });
  }

  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      } else {
        this.autoSubmit();
      }
    });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  autoSubmit(): void {
    this.stopTimer();
    this.messageService.add({
      severity: 'warn',
      summary: 'Hết giờ',
      detail: 'Thời gian làm bài đã hết. Bài thi sẽ được nộp tự động.',
    });
    this.submitExam();
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  get currentQuestion(): ExamQuestion | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get answeredCount(): number {
    return Object.values(this.answers).filter((a) => a !== '').length;
  }

  get progressPercent(): number {
    return this.questions.length > 0 ? (this.answeredCount / this.questions.length) * 100 : 0;
  }

  get isTimeWarning(): boolean {
    return this.remainingSeconds <= 300; // 5 minutes warning
  }

  get isTimeCritical(): boolean {
    return this.remainingSeconds <= 60; // 1 minute critical
  }

  selectAnswer(questionId: string, answerId: string): void {
    this.answers[questionId] = answerId;
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  isQuestionAnswered(index: number): boolean {
    const question = this.questions[index];
    return question ? this.answers[question.id] !== '' : false;
  }

  confirmSubmit(): void {
    this.showConfirmSubmit = true;
  }

  cancelSubmit(): void {
    this.showConfirmSubmit = false;
  }

  submitExam(): void {
    this.showConfirmSubmit = false;
    this.submitting = true;
    this.stopTimer();

    const submitAnswers: SubmitAnswer[] = Object.entries(this.answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    this.examService.submitExam(this.attemptId, submitAnswers).subscribe({
      next: (result: ExamResult) => {
        this.submitting = false;
        this.result = result;
        this.showResult = true;
      },
      error: (error) => {
        this.submitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: error.error?.error?.message || 'Không thể nộp bài',
        });
      },
    });
  }

  formatTimeSpent(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} phút ${secs} giây`;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  viewDetailedResult(): void {
    this.router.navigate(['/exam-result', this.attemptId]);
  }
}
