import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    TooltipModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <i class="pi pi-graduation-cap text-3xl text-blue-600"></i>
              <div>
                <h1 class="text-xl font-bold text-gray-800">Exam Prep</h1>
                <p class="text-xs text-gray-500">Learning Platform</p>
              </div>
            </div>

            <!-- Menu Items -->
            <div class="flex items-center gap-6">
              <!-- Public Menu -->
              <ng-container *ngIf="!isLoggedIn">
                <a routerLink="/" class="text-gray-700 hover:text-blue-600 transition">
                  Home
                </a>
                <a routerLink="/login" class="text-gray-700 hover:text-blue-600 transition">
                  Login
                </a>
                <button
                  pButton
                  label="Sign Up"
                  routerLink="/register"
                  class="p-button-sm"
                ></button>
              </ng-container>

              <!-- Customer Menu -->
              <ng-container *ngIf="isLoggedIn && !isAdmin">
                <a routerLink="/dashboard" class="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600 transition">
                  Exams
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600 transition">
                  Courses
                </a>
                <a href="#" class="text-gray-700 hover:text-blue-600 transition">
                  Materials
                </a>
              </ng-container>

              <!-- Admin Menu -->
              <ng-container *ngIf="isAdmin">
                <a routerLink="/admin/categories" class="text-gray-700 hover:text-blue-600 transition">
                  Categories
                </a>
                <a routerLink="/admin/questions" class="text-gray-700 hover:text-blue-600 transition">
                  Questions
                </a>
                <a routerLink="/admin/exams" class="text-gray-700 hover:text-blue-600 transition">
                  Exams
                </a>
                <a routerLink="/admin/articles" class="text-gray-700 hover:text-blue-600 transition">
                  Articles
                </a>
              </ng-container>

              <!-- User Menu -->
              <ng-container *ngIf="isLoggedIn">
                <div class="flex items-center gap-3 border-l pl-6">
                  <p-avatar
                    [label]="getUserInitials()"
                    shape="circle"
                    styleClass="bg-blue-600 text-white"
                  />
                  <div class="text-sm">
                    <div class="font-medium text-gray-800">{{ currentUser?.fullName }}</div>
                    <div class="text-xs text-gray-500">{{ currentUser?.role }}</div>
                  </div>
                  <button
                    pButton
                    icon="pi pi-sign-out"
                    class="p-button-text p-button-sm"
                    (click)="logout()"
                    pTooltip="Logout"
                  ></button>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main>
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="bg-gray-800 text-white mt-12">
        <div class="container mx-auto px-4 py-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 class="text-lg font-bold mb-4">Exam Prep Platform</h3>
              <p class="text-gray-400 text-sm">
                Your trusted partner for exam preparation and learning success.
              </p>
            </div>
            <div>
              <h4 class="font-semibold mb-3">Quick Links</h4>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><a href="#" class="hover:text-white">About Us</a></li>
                <li><a href="#" class="hover:text-white">Courses</a></li>
                <li><a href="#" class="hover:text-white">Exams</a></li>
                <li><a href="#" class="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-3">Support</h4>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><a href="#" class="hover:text-white">Help Center</a></li>
                <li><a href="#" class="hover:text-white">FAQ</a></li>
                <li><a href="#" class="hover:text-white">Terms of Service</a></li>
                <li><a href="#" class="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-3">Connect</h4>
              <div class="flex gap-3">
                <a href="#" class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <i class="pi pi-facebook"></i>
                </a>
                <a href="#" class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <i class="pi pi-twitter"></i>
                </a>
                <a href="#" class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <i class="pi pi-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 Exam Prep Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = false;
  isAdmin = false;
  currentUser: any = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    const names = this.currentUser.fullName.split(' ');
    return names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : names[0][0];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
