import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthenticateService, SessionService } from '../../../core/services';
import { FooterNavComponent } from '../../common-component/footer-nav/footer-nav.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ChartModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    AvatarModule,
    OverlayPanelModule,
    FooterNavComponent,
  ],
  templateUrl: './customer-dashboard.component.html'
})
export class CustomerDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private authenticateService = inject(AuthenticateService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  stats: DashboardStats | null = null;
  currentUser = this.authService.currentUserValue;
  loading = false;
  isLoggingOut = signal<boolean>(false);

  weeklyActivityData: any;
  scoreDistributionData: any;
  chartOptions: any;
  doughnutOptions: any;

  // User info
  userRole: string = '';
  userEmail: string = '';

  ngOnInit(): void {
    this.loadDashboardStats();
    this.initCharts();
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.userRole = this.sessionService.userRole || 'CUSTOMER';
    const userInfo = this.sessionService.userInformation;
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        this.userEmail = parsed.email || '';
      } catch (e) {
        this.userEmail = this.currentUser?.email || '';
      }
    }
  }

  getRoleLabel(): string {
    const labels: { [key: string]: string } = {
      CUSTOMER: 'Học viên',
      ADMIN: 'Quản trị viên',
      INSTRUCTOR: 'Giảng viên'
    };
    return labels[this.userRole] || this.userRole;
  }

  onLogout(): void {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);
    this.authenticateService.logOut().subscribe({
      next: () => {
        this.isLoggingOut.set(false);
      },
      error: () => {
        this.isLoggingOut.set(false);
        this.sessionService.destroySession();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.updateCharts();
      },
      error: () => {
        this.loading = false;
        // Use mock data
        this.stats = this.getMockStats();
        this.updateCharts();
      },
    });
  }

  initCharts(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
      },
    };

    this.doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
      },
    };
  }

  updateCharts(): void {
    // Weekly Activity Chart
    this.weeklyActivityData = {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      datasets: [
        {
          label: 'Số bài thi',
          data: [3, 5, 2, 8, 4, 6, 3],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    // Score Distribution Chart
    this.scoreDistributionData = {
      labels: ['< 50%', '50-70%', '70-85%', '> 85%'],
      datasets: [
        {
          data: [2, 5, 8, 10],
          backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
        },
      ],
    };
  }

  getScoreClass(score: number): string {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  }

  private getMockStats(): DashboardStats {
    return {
      totalExams: 25,
      completedExams: 18,
      averageScore: 78.5,
      totalCourses: 3,
      activeCourses: 2,
      studyTime: 45,
      recentActivities: [
        {
          type: 'EXAM',
          title: 'Đề thi Pháp luật cơ bản',
          date: new Date(),
          score: 85,
        },
        {
          type: 'COURSE',
          title: 'Khóa học Ngân hàng nâng cao',
          date: new Date(),
          progress: 65,
        },
      ],
    };
  }
}
