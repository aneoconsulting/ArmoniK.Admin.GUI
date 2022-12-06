import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ErrorComponent } from './pages/error/error.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'sessions', pathMatch: 'full' },
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
        path: 'results',
        loadChildren: () =>
          import('./pages/results-list/results-list.module').then(
            (m) => m.ResultsListModule
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
