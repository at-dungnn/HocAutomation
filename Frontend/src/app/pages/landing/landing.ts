import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: 'landing.html',
  imports: [CommonModule, ButtonModule],
  template: ``
})
export class Landing {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToDashboard() {
    this.router.navigate(['/auth/login']);
  }

  goToAdminLogin() {
    this.router.navigate(['/admin/login']);
  }
}
