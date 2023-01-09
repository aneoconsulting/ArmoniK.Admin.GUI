import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'applications', pathMatch: 'full' },
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

@Injectable({
  providedIn: 'root',
})
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);

    if (title !== undefined)
      this.title.setTitle(`${title} | Admin GUI - ArmoniK`);
  }
}

/**
 * Handle routing for the app
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy,
    },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
