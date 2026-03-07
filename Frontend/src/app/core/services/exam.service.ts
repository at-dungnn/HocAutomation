import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Exam {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  courseId?: string;
  type: 'PRACTICE' | 'MOCK_EXAM' | 'OFFICIAL';
  duration: number;
  passingScore: number;
  totalQuestions: number;
  totalPoints: number;
  questionCount?: number;
  randomize?: boolean;
  instructions?: string;
  isPublic: boolean;
  isPremium: boolean;
  isActive: boolean;
  attemptCount: number;
  averageScore?: number;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string };
  course?: { id: string; title: string };
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  categoryId: string;
  courseId?: string;
  type: 'PRACTICE' | 'MOCK_EXAM' | 'OFFICIAL';
  duration: number;
  passingScore: number;
  instructions?: string;
  isPublic?: boolean;
  isPremium?: boolean;
  questionIds?: string[];
  questionCount?: number;
  randomize?: boolean;
}

export interface UpdateExamRequest extends Partial<CreateExamRequest> {
  isActive?: boolean;
}

export interface ExamFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  courseId?: string;
  type?: string;
}

export interface RandomQuestionsResponse {
  questions: any[];
  totalAvailable: number;
  selected: number;
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
export class ExamService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/exams`;

  getExams(filters: ExamFilters = {}): Observable<{ data: Exam[]; total: number; pagination: any }> {
    let params = new HttpParams();

    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.courseId) params = params.set('courseId', filters.courseId);
    if (filters.type) params = params.set('type', filters.type);

    return this.http.get<ApiResponse<Exam[]>>(this.apiUrl, { params }).pipe(
      map((response) => ({
        data: response.data,
        total: response.pagination?.total || 0,
        pagination: response.pagination,
      }))
    );
  }

  getExamById(id: string): Observable<Exam> {
    return this.http.get<ApiResponse<Exam>>(`${this.apiUrl}/${id}`).pipe(map((response) => response.data));
  }

  createExam(data: CreateExamRequest): Observable<Exam> {
    return this.http.post<ApiResponse<Exam>>(this.apiUrl, data).pipe(map((response) => response.data));
  }

  updateExam(id: string, data: UpdateExamRequest): Observable<Exam> {
    return this.http.put<ApiResponse<Exam>>(`${this.apiUrl}/${id}`, data).pipe(map((response) => response.data));
  }

  deleteExam(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map(() => undefined));
  }

  getRandomQuestions(categoryId: string, courseId?: string, count = 10): Observable<RandomQuestionsResponse> {
    let params = new HttpParams()
      .set('categoryId', categoryId)
      .set('count', count.toString());

    if (courseId) {
      params = params.set('courseId', courseId);
    }

    return this.http.get<ApiResponse<RandomQuestionsResponse>>(`${this.apiUrl}/random-questions`, { params })
      .pipe(map((response) => response.data));
  }
}
