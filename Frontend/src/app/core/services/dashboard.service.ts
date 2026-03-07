import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  totalCourses: number;
  activeCourses: number;
  studyTime: number;
  recentActivities: RecentActivity[];
}

export interface RecentActivity {
  type: 'EXAM' | 'COURSE' | 'MATERIAL';
  title: string;
  date: Date;
  score?: number;
  progress?: number;
}

export interface LearningProgress {
  categoryProgress: CategoryProgress[];
  weeklyActivity: WeeklyActivity[];
  achievements: Achievement[];
}

export interface CategoryProgress {
  categoryId: string;
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface WeeklyActivity {
  date: string;
  examsCompleted: number;
  studyTime: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getProgress(): Observable<LearningProgress> {
    return this.http.get<LearningProgress>(`${this.apiUrl}/progress`);
  }
}
