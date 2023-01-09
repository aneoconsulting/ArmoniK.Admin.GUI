import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationService } from '../../../shared/data-access';
import { RedirectService } from '../../../shared/util';
import { CanActivateSessionsListService } from '../../data-access';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateSessionsListService],
    loadChildren: () =>
      import('../sessions-list/sessions-list.module').then(
        (m) => m.SessionsListModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    CanActivateSessionsListService,
    AuthorizationService,
    RedirectService,
  ],
  exports: [RouterModule],
})
export class SessionsShellRoutingModule {}
