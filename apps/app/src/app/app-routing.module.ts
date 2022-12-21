import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'applications', pathMatch: 'full' },
  {
    path: 'applications',
    loadChildren: () =>
      import(
        './applications/feature/applications-list/applications-list.module'
      ).then((m) => m.ApplicationsListModule),
  },
  {
    path: 'sessions',
    loadChildren: () =>
      import('./sessions/feature/sessions-list/sessions-list.module').then(
        (m) => m.SessionsListModule
      ),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./tasks/feature/tasks-list/tasks-list.module').then(
        (m) => m.TasksListModule
      ),
  },
  {
    path: 'results',
    loadChildren: () =>
      import('./results/feature/results-list/results-list.module').then(
        (m) => m.ResultsListModule
      ),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./error/feature/error-detail/error-detail.module').then(
        (m) => m.ErrorDetailModule
      ),
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
