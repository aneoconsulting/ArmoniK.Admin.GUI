import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('./profile/routes').then(mod => mod.PROFILE_ROUTES)
  },
  {
    path: 'applications',
    loadChildren: () => import('./applications/routes').then(mod => mod.APPLICATIONS_ROUTES)
  },
  {
    path: 'partitions',
    loadChildren: () => import('./partitions/routes').then(mod => mod.PARTITIONS_ROUTES)
  },
  {
    path: 'sessions',
    loadChildren: () => import('./sessions/routes').then(mod => mod.SESSIONS_ROUTES)
  },
  {
    path: 'results',
    loadChildren: () => import('./results/routes').then(mod => mod.RESULTS_ROUTES)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/routes').then(mod => mod.SETTINGS_ROUTES)
  },
];
