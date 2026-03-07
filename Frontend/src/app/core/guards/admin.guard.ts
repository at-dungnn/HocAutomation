import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check from AuthService first
  if (authService.isAuthenticated && authService.isAdmin) {
    return true;
  }

  // Fallback: check directly from localStorage
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('currentUser');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'ADMIN') {
        return true;
      }
    } catch (e) {
      // Invalid JSON
    }
  }

  // Also check SessionService format (ROLE key)
  const role = localStorage.getItem('ROLE');
  if (token && role === 'ADMIN') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
