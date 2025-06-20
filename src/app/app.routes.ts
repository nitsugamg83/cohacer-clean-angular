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
      },
      {
      path: 'mi-proceso',
        loadComponent: () =>
          import('./pages/mi-proceso/mi-proceso.component').then(m => m.MiProcesoComponent)
      },
      {
        path: 'casopractico',
        loadComponent: () =>
          import('./pages/caso-practico/caso-practico.component').then(m => m.CasoPracticoComponent)
      },
      {
        path: 'crear-casopractico',
        loadComponent: () =>
          import('./pages/caso-practico/crear-proceso/crear-proceso.component').then(m => m.CrearProcesoComponent)
      },
      {
        path: 'enrrolls-documents',
        loadComponent: () =>
          import('./pages/enroll-documents/enroll-documents.component').then(m => m.EnrollDocumentsComponent)
      },
      {
        path: 'armado-fisico',
        loadComponent: () =>
          import('./pages/armado-fisico/armado-fisico/armado-fisico.component').then(m => m.ArmadoFisicoComponent)
      }



    ]
  }
];
