import { Routes } from '@angular/router';
import { ApplicationsAccessGuard } from './applications/guards/applications-access.guard';
import { PartitionsAccessGuard } from './partitions/guards/partitions-access.guard';
import { ResultsAccessGuard } from './results/guards/results-access.guard';
import { SessionsAccessGuard } from './sessions/guards/sessions-access.guard';
import { TasksAccessGuard } from './tasks/guards/tasks-access.guard';

export const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('./profile/routes').then(mod => mod.PROFILE_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/routes').then(mod => mod.DASHBOARD_ROUTES)
  },
  {
    path: 'applications',
    loadChildren: () => import('./applications/routes').then(mod => mod.APPLICATIONS_ROUTES),
    canActivate: [ApplicationsAccessGuard]
  },
  {
    path: 'partitions',
    loadChildren: () => import('./partitions/routes').then(mod => mod.PARTITIONS_ROUTES),
    canActivate: [PartitionsAccessGuard]
  },
  {
    path: 'sessions',
    loadChildren: () => import('./sessions/routes').then(mod => mod.SESSIONS_ROUTES),
    canActivate: [SessionsAccessGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/routes').then(mod => mod.TASKS_ROUTES),
    canActivate: [TasksAccessGuard]
  },
  {
    path: 'results',
    loadChildren: () => import('./results/routes').then(mod => mod.RESULTS_ROUTES),
    canActivate: [ResultsAccessGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/routes').then(mod => mod.SETTINGS_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
