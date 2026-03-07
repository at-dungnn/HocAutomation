import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'LAW' | 'BANKING' | 'PUBLIC_ADMINISTRATION' | 'GENERAL_KNOWLEDGE' | 'ENGLISH' | 'MATH' | 'OTHER';
  parentId?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  type: string;
  parentId?: string;
  order?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/categories`;
  private publicApiUrl = `${environment.apiUrl}/categories`;

  // Admin endpoints
  getCategories(isActive?: boolean): Observable<Category[]> {
    const params: any = {};
    if (isActive !== undefined) {
      params.isActive = isActive.toString();
    }
    
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl, { params })
      .pipe(map(response => response.data));
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, data)
      .pipe(map(response => response.data));
  }

  updateCategory(id: string, data: Partial<CreateCategoryRequest> & { isActive?: boolean }): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, data)
      .pipe(map(response => response.data));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  getCategoryTree(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/tree`)
      .pipe(map(response => response.data));
  }

  // Public endpoint
  getPublicCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.publicApiUrl)
      .pipe(map(response => response.data));
  }
}
