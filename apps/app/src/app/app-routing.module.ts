import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateUser } from './shared/data-access';

const routes: Routes = [
  { path: '', redirectTo: 'applications', pathMatch: 'full' },
  {
    path: '',
    canActivate: [CanActivateUser],
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./users/feature/users-shell/users-shell.module').then(
            (m) => m.UsersShellModule
          ),
      },
      {
        path: 'applications',
        loadChildren: () =>
          import(
            './applications/feature/applications-shell/applications-shell.module'
          ).then((m) => m.ApplicationsShellModule),
      },
      {
        path: 'sessions',
        loadChildren: () =>
          import(
            './sessions/feature/sessions-shell/sessions-shell.module'
          ).then((m) => m.SessionsShellModule),
      },
      {
        path: 'tasks',
        loadChildren: () =>
          import('./tasks/feature/tasks-shell/tasks-shell.module').then(
            (m) => m.TasksShellModule
          ),
      },
      {
        path: 'results',
        loadChildren: () =>
          import('./results/feature/results-shell/results-shell.module').then(
            (m) => m.ResultsShellModule
          ),
      },
      {
        path: 'how-to-use',
        loadChildren: () =>
          import('./how-to-use/how-to-use.module').then(
            (m) => m.HowToUseModule
          ),
      },
    ],
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
