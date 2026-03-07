import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  categoryId: string;
  coverImage?: string;
  price: number;
  discountPrice?: number;
  duration?: number;
  level?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  enrollmentCount: number;
  rating?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  categoryId: string;
  coverImage?: string;
  price?: number;
  discountPrice?: number;
  duration?: number;
  level?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isPublished?: boolean;
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
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/courses`;

  getCourses(page = 1, limit = 10, categoryId?: string, status?: string): Observable<{ courses: Course[]; pagination: any }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<Course[]>>(this.apiUrl, { params }).pipe(
      map((response) => ({
        courses: response.data,
        pagination: response.pagination,
      }))
    );
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<ApiResponse<Course>>(`${this.apiUrl}/${id}`).pipe(map((response) => response.data));
  }

  createCourse(data: CreateCourseRequest): Observable<Course> {
    return this.http.post<ApiResponse<Course>>(this.apiUrl, data).pipe(map((response) => response.data));
  }

  updateCourse(id: string, data: UpdateCourseRequest): Observable<Course> {
    return this.http.put<ApiResponse<Course>>(`${this.apiUrl}/${id}`, data).pipe(map((response) => response.data));
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map(() => undefined));
  }
}
