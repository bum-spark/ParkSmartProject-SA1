import { Routes } from '@angular/router';
import { authGuard, noAuthGuard, rootRedirectGuard } from './Shared/Guards/auth-guard';
import { SignIn } from './Pages/Public/Auth/SignIn/SignIn';
import { SignUp } from './Pages/Public/Auth/SignUp/SignUp';
import { HomePage } from './Pages/Private/HomePage/HomePage';
import { DashboardSede } from './Pages/Private/DashboardSede/DashboardSede';
import { DashboardOverview } from './Pages/Private/DashboardSede/Pages/DashboardOverview/DashboardOverview';
import { DashboardMapa } from './Pages/Private/DashboardSede/Pages/DashboardMapa/DashboardMapa';
import { DashboardReservas } from './Pages/Private/DashboardSede/Pages/DashboardReservas/DashboardReservas';
import { DashboardHistorial } from './Pages/Private/DashboardSede/Pages/DashboardHistorial/DashboardHistorial';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [rootRedirectGuard],
    component: SignIn
  },
  {
    path: 'auth',
    children: [
      {
        path: 'signin',
        component: SignIn,
        canActivate: [noAuthGuard]
      },
      {
        path: 'signup',
        component: SignUp,
        canActivate: [noAuthGuard]
      },
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full'
      }
    ]
  },
  
  {
    path: 'home',
    component: HomePage,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/:sedeId',
    component: DashboardSede,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardOverview
      },
      {
        path: 'mapa',
        component: DashboardMapa
      },
      {
        path: 'reservas',
        component: DashboardReservas
      },
      {
        path: 'historial',
        component: DashboardHistorial
      }
    ]
  },
  
  {
    path: '**',
    canActivate: [rootRedirectGuard],
    component: SignIn
  }
];
