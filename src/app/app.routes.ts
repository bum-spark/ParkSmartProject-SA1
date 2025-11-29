import { Routes } from '@angular/router';
import { authGuard } from './Shared/Guards/auth-guard';

export const routes: Routes = [
  // Ruta por defecto - redirige al login
  {
    path: '',
    redirectTo: 'auth/signin',
    pathMatch: 'full'
  },
  
  // Rutas públicas (Autenticación)
  {
    path: 'auth',
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./Pages/Public/Auth/SignIn/SignIn').then(m => m.SignIn)
      },
      {
        path: 'signup',
        loadComponent: () => import('./Pages/Public/Auth/SignUp/SignUp').then(m => m.SignUp)
      },
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full'
      }
    ]
  },
  
  // Rutas privadas (requieren autenticación)
  {
    path: 'home',
    loadComponent: () => import('./Pages/Private/HomePage/HomePage').then(m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/:sedeId',
    loadComponent: () => import('./Pages/Private/DashboardSede/DashboardSede').then(m => m.DashboardSede),
    canActivate: [authGuard]
  },
  
  // Ruta 404 - redirige al login
  {
    path: '**',
    redirectTo: 'auth/signin'
  }
];
