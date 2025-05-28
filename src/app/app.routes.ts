// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'administracion/financiar',
        loadComponent: () =>
          import('./pages/admin-unfinanced/admin-unfinanced.component').then(m => m.AdminUnfinancedComponent)
      },
      {
        path: 'administracion/ligasdepago',
        loadComponent: () =>
          import('./pages/admin-payment-links/admin-payment-links.component').then(m => m.AdminPaymentLinksComponent)
      },
      {
        path: 'evaluadora/iutmrevision',
        loadComponent: () =>
          import('./pages/evaluadora-revision/evaluadora-revision.component').then(m => m.AdminEvaluadoraRevisionComponent)
      }


    ]
  }
];
