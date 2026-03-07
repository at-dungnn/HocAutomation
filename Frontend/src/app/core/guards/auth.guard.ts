import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check both AuthService and localStorage
  const token = localStorage.getItem('accessToken');
  
  if (authService.isAuthenticated || token) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
