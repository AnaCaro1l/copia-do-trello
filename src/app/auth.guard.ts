import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = localStorage.getItem('auth');
  if (auth === 'true') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
