import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationService } from '../../../shared/data-access';
import { CanActivateTasksListService } from '../../data-access';
import { RedirectService } from '../../../shared/util';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateTasksListService],
    loadChildren: () =>
      import('../tasks-list/tasks-list.module').then((m) => m.TasksListModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    CanActivateTasksListService,
    AuthorizationService,
    RedirectService,
  ],
  exports: [RouterModule],
})
export class TasksShellRoutingModule {}
