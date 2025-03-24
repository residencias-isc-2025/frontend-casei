import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

export const userRoleGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  const token = auth.getToken();

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  const userRole = userService.obtenerRolUsuario();
  if (userRole === 'superuser' || userRole === 'admin') {
    return true;
  }

  router.navigate(['/dashboard/perfil']);
  return false;
};
