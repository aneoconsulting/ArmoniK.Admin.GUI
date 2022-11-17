import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/pages/error/error.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    data: { key: 'dashboard' },
    loadComponent: () =>
      import('./pages/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'applications',
    loadComponent: () =>
      import('./pages/pages/sessions/sessions.component').then(
        (m) => m.SessionsComponent
      ),
  },
  {
    path: 'sessions',
    loadComponent: () =>
      import('./pages/pages/sessions-list/sessions-list.component').then(
        (m) => m.SessionsListComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/pages/tasks-list/tasks-list.component').then(
        (m) => m.TasksListComponent
      ),
  },
  {
    path: 'errors',
    loadComponent: () =>
      import(
        './pages/pages/tasks-errors-list/tasks-errors-list.component'
      ).then((m) => m.TasksErrorsListComponent),
  },
  {
    path: 'how-to-use',
    loadComponent: () =>
      import('./pages/pages/how-to-use/how-to-use.component').then(
        (m) => m.HowToUseComponent
      ),
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
];

/**
 * Handle routing for the app
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
