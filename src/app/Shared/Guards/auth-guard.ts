import type { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '../Services/localStorage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const localStorage = inject(LocalStorage);
  const router = inject(Router);
  
  if (localStorage.estaAutenticado()) {
    return true;
  }
  
  router.navigate(['/auth/signin']);
  return false;
};
