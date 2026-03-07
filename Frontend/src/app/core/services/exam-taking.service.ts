import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ExamQuestion {
  id: string;
  order: number;
  content: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
  options?: { id: string; text: string }[];
  points: number;
}

export interface ExamInfo {
  id: string;
  title: string;
  description?: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  instructions?: string;
}

export interface StartExamResponse {
  attemptId: string;
  exam: ExamInfo;
  questions: ExamQuestion[];
  startedAt: string;
}

export interface SubmitAnswer {
  questionId: string;
  answer: string;
}

export interface ExamResult {
  attemptId: string;
  status: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  isPassed: boolean;
  timeSpent: number;
  completedAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  status: string;
  score?: number;
  isPassed?: boolean;
  startedAt: string;
  completedAt?: string;
  timeSpent?: number;
  exam?: {
    title: string;
    duration: number;
    passingScore: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ExamTakingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/exams`;

  // Get available exams for customer
  getAvailableExams(page = 1, limit = 10, categoryId?: string): Observable<{ data: any[]; total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<ApiResponse<any[]>>(this.apiUrl, { params }).pipe(
      map((response) => ({
        data: response.data,
        total: response.pagination?.total || 0,
      }))
    );
  }

  // Get exam details
  getExamById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  // Start exam - returns questions
  startExam(examId: string): Observable<StartExamResponse> {
    return this.http.post<ApiResponse<StartExamResponse>>(`${this.apiUrl}/${examId}/start`, {}).pipe(
      map((response) => response.data)
    );
  }

  // Submit exam answers
  submitExam(attemptId: string, answers: SubmitAnswer[]): Observable<ExamResult> {
    return this.http.post<ApiResponse<ExamResult>>(`${this.apiUrl}/attempts/${attemptId}/submit`, { answers }).pipe(
      map((response) => response.data)
    );
  }

  // Get attempt result
  getAttemptResult(attemptId: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/attempts/${attemptId}/result`).pipe(
      map((response) => response.data)
    );
  }

  // Get user's exam history
  getMyExamHistory(page = 1, limit = 10): Observable<{ data: ExamAttempt[]; total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<ExamAttempt[]>>(`${this.apiUrl}/my-history`, { params }).pipe(
      map((response) => ({
        data: response.data,
        total: response.pagination?.total || 0,
      }))
    );
  }
}
