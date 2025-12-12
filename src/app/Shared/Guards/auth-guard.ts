import type { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '../Services/localStorage.service';

/**
 * Si el usuario no esta autenticado va a signin.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const localStorage = inject(LocalStorage);
  const router = inject(Router);
  
  if (localStorage.estaAutenticado()) {
    return true;
  }
  
  router.navigate(['/auth/signin']);
  return false;
};

/**
 * Si el usuario esta autenticado, redirige a home.
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const localStorage = inject(LocalStorage);
  const router = inject(Router);
  
  if (localStorage.estaAutenticado()) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};

/**
 * Si esta autenticado -> home
 * Si no esta autenticado -> signin
 */
export const rootRedirectGuard: CanActivateFn = (route, state) => {
  const localStorage = inject(LocalStorage);
  const router = inject(Router);
  
  if (localStorage.estaAutenticado()) {
    router.navigate(['/home']);
  } else {
    router.navigate(['/auth/signin']);
  }
  
  return false;
};
