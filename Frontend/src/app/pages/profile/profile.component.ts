import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthUser } from 'src/app/shared';
import { AuthenticateService, SessionService } from 'src/app/core/services';
import { FooterNavComponent } from '../common-component/footer-nav/footer-nav.component';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { DashboardService, DashboardStats } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterNavComponent, ButtonModule, AvatarModule, TagModule, SkeletonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user = signal<AuthUser | null>(null);
  stats = signal<DashboardStats | null>(null);
  isLoading = signal<boolean>(false);
  isLoadingStats = signal<boolean>(false);
  errorMessage = signal<string>('');
  isLoggingOut = signal<boolean>(false);
  userRole: string = '';

  constructor(
    private authenticateService: AuthenticateService,
    private sessionService: SessionService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.sessionService.userRole || 'CUSTOMER';
    this.loadProfile();
    this.loadStats();
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.authenticateService.getProfile().subscribe({
      next: (profile) => {
        this.user.set(profile);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message || error?.message || 'Không thể tải thông tin tài khoản.');
        this.isLoading.set(false);
        // Try to get from session
        const userInfo = this.sessionService.userInformation;
        if (userInfo) {
          try {
            const parsed = JSON.parse(userInfo);
            this.user.set(parsed as AuthUser);
            this.errorMessage.set('');
          } catch (e) {
            // Keep error message
          }
        }
      }
    });
  }

  private loadStats(): void {
    this.isLoadingStats.set(true);
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoadingStats.set(false);
      },
      error: () => {
        // Use mock data
        this.stats.set({
          totalExams: 25,
          completedExams: 18,
          averageScore: 78.5,
          totalCourses: 3,
          activeCourses: 2,
          studyTime: 45,
          recentActivities: []
        });
        this.isLoadingStats.set(false);
      }
    });
  }

  onLogout(): void {
    if (this.isLoggingOut()) return;

    this.isLoggingOut.set(true);
    this.authenticateService.logOut().subscribe({
      next: () => this.isLoggingOut.set(false),
      error: () => {
        this.isLoggingOut.set(false);
        this.sessionService.destroySession();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  getRoleLabel(): string {
    const labels: { [key: string]: string } = {
      CUSTOMER: 'Học viên',
      ADMIN: 'Quản trị viên',
      INSTRUCTOR: 'Giảng viên'
    };
    return labels[this.userRole] || this.userRole;
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
