import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/pages/error/error.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    data: { key: 'dashboard' },
    loadChildren: () =>
      import('./pages/pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'applications',
    loadChildren: () =>
      import('./pages/pages/sessions/sessions.module').then(
        (m) => m.SessionsModule
      ),
  },
  {
    path: 'sessions',
    loadChildren: () =>
      import('./pages/pages/sessions-list/sessions-list.module').then(
        (m) => m.SessionsListModule
      ),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./pages/pages/tasks-list/tasks-list.module').then(
        (m) => m.TasksListModule
      ),
  },
  {
    path: 'errors',
    loadChildren: () =>
      import('./pages/pages/tasks-errors-list/tasks-errors-list.module').then(
        (m) => m.TasksErrorsListModule
      ),
  },
  {
    path: 'how-to-use',
    loadChildren: () =>
      import('./pages/pages/how-to-use/how-to-use.module').then(
        (m) => m.HowToUseModule
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
