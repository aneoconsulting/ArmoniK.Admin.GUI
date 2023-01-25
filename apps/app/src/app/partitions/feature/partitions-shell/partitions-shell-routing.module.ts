import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationService } from '../../../shared/data-access';
import { CanActivatePartitionsListService } from '../../data-access';
import { RedirectService } from '../../../shared/util';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivatePartitionsListService],
    loadChildren: () =>
      import('../partitions-list/partitions-list.module').then(
        (m) => m.PartitionsListModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    CanActivatePartitionsListService,
    AuthorizationService,
    RedirectService,
  ],
  exports: [RouterModule],
})
export class PartitionsShellRoutingModule {}
