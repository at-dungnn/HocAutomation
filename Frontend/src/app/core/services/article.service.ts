import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiBaseService } from '../http/crud.service';
import { ApiResponse } from '../http/api-response';

export type ArticleType = 'NEWS' | 'HOT_NEWS' | 'STUDY_TIPS' | 'EXPERIENCE' | 'ANNOUNCEMENT';
export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  type: ArticleType;
  status: ArticleStatus;
  authorId: string;
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleInput {
  title: string;
  content: string;
  excerpt: string;
  type: ArticleType;
  status: ArticleStatus;
}

export interface UpdateArticleInput {
  title?: string;
  content?: string;
  excerpt?: string;
  type?: ArticleType;
  status?: ArticleStatus;
}

export interface ArticleListQuery {
  page?: number;
  limit?: number;
  type?: ArticleType;
  status?: ArticleStatus;
  search?: string;
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends ApiBaseService {
  constructor(public override httpClient: HttpClient) {
    super(httpClient);
  }

  // Public APIs
  getPublicArticles(query: ArticleListQuery): Observable<ArticleListResponse> {
    const params: any = {};
    if (query.page) params.page = query.page.toString();
    if (query.limit) params.limit = query.limit.toString();
    if (query.type) params.type = query.type;
    if (query.search) params.search = query.search;

    return this.httpClient
      .get<ApiResponse<ArticleListResponse>>(`${this.apiBasePath}/api/articles`, { params })
      .pipe(
        map((response) => {
          if (!response?.success || !response.data) {
            throw new Error(response?.message || 'Không thể lấy danh sách bài viết');
          }
          return response.data;
        })
      );
  }

  getHotNews(limit = 5): Observable<Article[]> {
    return this.httpClient
      .get<ApiResponse<Article[]>>(`${this.apiBasePath}/api/articles/hot`, {
        params: { limit: limit.toString() }
      })
      .pipe(
        map((response) => {
          if (!response?.success || !response.data) {
            throw new Error(response?.message || 'Không thể lấy tin nóng');
          }
          return response.data;
        })
      );
  }

  getArticleBySlug(slug: string): Observable<Article> {
    return this.httpClient
      .get<ApiResponse<Article>>(`${this.apiBasePath}/api/articles/${slug}`)
      .pipe(
        map((response) => {
          if (!response?.success || !response.data) {
            throw new Error(response?.message || 'Không thể lấy bài viết');
          }
          return response.data;
        })
      );
  }

  // Admin APIs
  getAllArticles(query: ArticleListQuery): Observable<ArticleListResponse> {
    const params: any = {};
    if (query.page) params.page = query.page.toString();
    if (query.limit) params.limit = query.limit.toString();
    if (query.type) params.type = query.type;
    if (query.status) params.status = query.status;
    if (query.search) params.search = query.search;

    return this.httpClient
      .get<ApiResponse<ArticleListResponse>>(`${this.apiBasePath}/api/admin/articles`, { params })
      .pipe(
        map((response) => {
          if (!response?.success || !response.data) {
            throw new Error(response?.message || 'Không thể lấy danh sách bài viết');
          }
          return response.data;
        })
      );
  }

  getArticleById(id: string): Observable<Article> {
    return this.httpClient
      .get<ApiResponse<Article>>(`${this.apiBasePath}/api/admin/articles/${id}`)
      .pipe(
        map((response) => {
          if (!response?.success || !response.data) {
            throw new Error(response?.message || 'Không thể lấy bài viết');
          }
          return response.data;
        })
      );
  }

  createArticle(input: CreateArticleInput): Observable<Article> {
    return this.httpClient
      .post<ApiResponse<Article>>(`${this.apiBasePath}/api/admin/articles`, input)
      .pipe(
        map((response) => {
          if (!response?.success || !response.data) {
            throw new Error(response?.message || 'Không thể tạo bài viết');
          }
          return response.data;
        })
      );
  }

  updateArticle(id: string, input: UpdateArticleInput): Observable<Article> {
    return this.httpClient
      .put<ApiResponse<Article>>(`${this.apiBasePath}/api/admin/articles/${id}`, input)
      .pipe(
        map((response) => {
          if (!response?.success || !response.data) {
            throw new Error(response?.message || 'Không thể cập nhật bài viết');
          }
          return response.data;
        })
      );
  }

  deleteArticle(id: string): Observable<void> {
    return this.httpClient
      .delete<ApiResponse>(`${this.apiBasePath}/api/admin/articles/${id}`)
      .pipe(
        map((response) => {
          if (!response?.success) {
            throw new Error(response?.message || 'Không thể xóa bài viết');
          }
          return void 0;
        })
      );
  }
}
