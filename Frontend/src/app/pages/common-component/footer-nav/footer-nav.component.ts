import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from 'src/app/core/services';

@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer-nav.component.html'
})
export class FooterNavComponent implements OnInit {
  userRole: string = '';
  currentRoute: string = '';

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.sessionService.userRole;
    this.currentRoute = this.router.url;
    
    // Subscribe to route changes
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  isActive(route: string): boolean {
    if (route === '/dashboard') {
      return this.currentRoute === '/dashboard' || this.currentRoute === '/dashboard/';
    }
    return this.currentRoute.startsWith(route);
  }
}
