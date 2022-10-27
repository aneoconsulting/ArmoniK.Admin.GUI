import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ErrorComponent } from './pages/error/error.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        data: { key: 'dashboard' },
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'applications',
        loadChildren: () =>
          import('./pages/sessions/sessions.module').then(
            (m) => m.SessionsModule
          ),
      },
      {
        path: 'applications-2',
        loadChildren: () =>
          import('./pages/applications-list/applications-list.module').then(
            (m) => m.ApplicationsListModule
          ),
      },
      {
        path: 'sessions',
        loadChildren: () =>
          import('./pages/sessions-list/sessions-list.module').then(
            (m) => m.SessionsListModule
          ),
      },
      {
        path: 'tasks',
        loadChildren: () =>
          import('./pages/tasks-list/tasks-list.module').then(
            (m) => m.TasksListModule
          ),
      },
      {
        path: 'errors',
        loadChildren: () =>
          import('./pages/tasks-errors-list/tasks-errors-list.module').then(
            (m) => m.TasksErrorsListModule
          ),
      },
      {
        path: 'how-to-use',
        loadChildren: () =>
          import('./pages/how-to-use/how-to-use.module').then(
            (m) => m.HowToUseModule
          ),
      },
      {
        path: 'error',
        component: ErrorComponent,
      },
    ],
  },
];

/**
 * Handle routing for the pages
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
