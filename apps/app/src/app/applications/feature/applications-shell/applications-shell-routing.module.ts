import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationService } from '../../../shared/data-access';
import { CanActivateApplicationsListService } from '../../data-access';
import { RedirectService } from '../../../shared/util';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateApplicationsListService],
    loadChildren: () =>
      import('../applications-list/applications-list.module').then(
        (m) => m.ApplicationsListModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    CanActivateApplicationsListService,
    AuthorizationService,
    RedirectService,
  ],
  exports: [RouterModule],
})
export class ApplicationsShellRoutingModule {}
