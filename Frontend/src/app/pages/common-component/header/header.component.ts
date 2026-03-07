import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarModule } from 'primeng/avatar';
import { AuthenticateService, SessionService } from 'src/app/core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, BadgeModule, OverlayPanelModule, AvatarModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  userRole: string = '';
  userEmail: string = '';

  constructor(
    private sessionService: SessionService,
    private authenticateService: AuthenticateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.sessionService.userRole;
    const userInfo = this.sessionService.userInformation;
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        this.userEmail = parsed.email || '';
      } catch (e) {
        this.userEmail = '';
      }
    }
  }

  getRoleLabel(): string {
    const labels: { [key: string]: string } = {
      CUSTOMER: 'Khách hàng',
      SHIPPER: 'Người giao hàng',
      ADMIN: 'Quản trị viên',
      PROVIDER: 'Nhà cung cấp'
    };
    return labels[this.userRole] || this.userRole;
  }

  getRoleIcon(): string {
    const icons: { [key: string]: string } = {
      CUSTOMER: 'pi-user',
      SHIPPER: 'pi-car',
      ADMIN: 'pi-shield',
      PROVIDER: 'pi-building'
    };
    return icons[this.userRole] || 'pi-user';
  }

  onLogout(): void {
    this.authenticateService.logOut().subscribe({
      next: () => {
        // Already handled in service (navigate to login)
      },
      error: () => {
        // Even on error, clear session and navigate
        this.sessionService.destroySession();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
