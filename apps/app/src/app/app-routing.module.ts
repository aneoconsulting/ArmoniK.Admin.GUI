import {
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { AuthorizationService, CanActivateUser } from './shared/data-access';
import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CanActivatePartitionsListService } from './partitions/data-access';
import { RedirectService } from './shared/util';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
        path: 'dashboard',
        title: $localize`Dashboard`,
        loadComponent: () =>
          import('@armonik.admin.gui/pages/dashboard').then(
            (m) => m.DashboardComponent
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
        path: 'partitions',
        canActivate: [CanActivatePartitionsListService],
        loadComponent: () =>
          import('@armonik.admin.gui/pages/partitions').then((m) => m.PartitionsListComponent),
      },
      {
        path: 'partitions/:partitionId',
        loadComponent: () =>
          import('@armonik.admin.gui/pages/partitions').then((m) => m.PartitionGetComponent),
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
    ],
  },
  {
    path: ':statusCode',
    loadChildren: () =>
      import('./errors/feature/errors-shell/errors-shell.module').then(
        (m) => m.ErrorsShellModule
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
    AuthorizationService,
    RedirectService,
    CanActivatePartitionsListService
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
