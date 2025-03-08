import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { UsersService } from '@presentation/services';

export const userRoleGuard: CanMatchFn = () => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  const token = localStorage.getItem('casei_residencias_access_token');
  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  const userRole = usersService.getUserRole();
  if (userRole === 'superuser' || userRole === 'admin') {
    return true;
  }

  router.navigate(['/dashboard/perfil']);
  return false;
};
