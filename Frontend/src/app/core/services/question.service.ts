import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  categoryId: string;
  courseId?: string;
  content: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  options?: QuestionOption[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
  timeLimit?: number;
  tags: string[];
  isActive: boolean;
  usageCount: number;
  correctRate?: number;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateQuestionRequest {
  categoryId: string;
  courseId: string;
  content: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  options?: QuestionOption[];
  correctAnswer?: string;
  explanation?: string;
  points?: number;
  timeLimit?: number;
  tags?: string[];
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {
  isActive?: boolean;
}

export interface QuestionFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  courseId?: string;
  difficulty?: string;
  type?: string;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/questions`;

  getQuestions(filters: QuestionFilters = {}): Observable<{ data: Question[]; total: number; pagination: any }> {
    let params = new HttpParams();

    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.courseId) params = params.set('courseId', filters.courseId);
    if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get<ApiResponse<Question[]>>(this.apiUrl, { params }).pipe(
      map((response) => ({
        data: response.data,
        total: response.pagination?.total || 0,
        pagination: response.pagination,
      }))
    );
  }

  getQuestionById(id: string): Observable<Question> {
    return this.http.get<ApiResponse<Question>>(`${this.apiUrl}/${id}`).pipe(map((response) => response.data));
  }

  createQuestion(data: CreateQuestionRequest): Observable<Question> {
    return this.http.post<ApiResponse<Question>>(this.apiUrl, data).pipe(map((response) => response.data));
  }

  updateQuestion(id: string, data: UpdateQuestionRequest): Observable<Question> {
    return this.http.put<ApiResponse<Question>>(`${this.apiUrl}/${id}`, data).pipe(map((response) => response.data));
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map(() => undefined));
  }
}
