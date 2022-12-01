import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

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
        path: 'sessions',
        loadChildren: () =>
          import(
            './pages/sessions/features/sessions-list/sessions-list.module'
          ).then((m) => m.SessionsListModule),
      },
      {
        path: 'tasks',
        loadChildren: () =>
          import('./pages/tasks/features/tasks-list/tasks-list.module').then(
            (m) => m.TasksListModule
          ),
      },
      {
        path: 'results',
        loadChildren: () =>
          import(
            './pages/results/features/results-list/results-list.module'
          ).then((m) => m.ResultsListModule),
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
        loadChildren: () =>
          import(
            './pages/error/features/error-detail/error-detail.module'
          ).then((m) => m.ErrorDetailModule),
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
