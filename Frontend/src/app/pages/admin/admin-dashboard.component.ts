import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { AuthenticateService } from 'src/app/core/services';
import { AdminService } from 'src/app/core/services/admin.service';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, ChartModule, TooltipModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  adminName = '';
  stats: DashboardStats = {
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalEnrollments: 0
  };
  isLoading = true;

  constructor(
    private authenticateService: AuthenticateService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAdminInfo();
    this.loadStats();
  }

  loadAdminInfo(): void {
    this.authenticateService.getProfile().subscribe({
      next: (user) => {
        this.adminName = user.name || user.email;
      },
      error: () => {
        this.adminName = 'Admin';
      }
    });
  }

  loadStats(): void {
    this.isLoading = true;
    this.adminService.getStats().subscribe({
      next: (stats: any) => {
        // Map API response to dashboard stats
        this.stats = {
          totalUsers: stats.totalUsers || 0,
          totalStudents: stats.totalStudents || 0,
          totalInstructors: stats.totalInstructors || 0,
          totalCourses: stats.totalCourses || 0,
          activeCourses: stats.activeCourses || 0,
          totalEnrollments: stats.totalEnrollments || 0
        };
        this.isLoading = false;
      },
      error: () => {
        // Fallback to default values
        this.isLoading = false;
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/admin/${path}`]);
  }

  logout(): void {
    this.authenticateService.logOut().subscribe();
  }
}
