import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectService } from '../../../shared/util';
import { AuthorizationService } from '../../../shared/data-access';
import { CanActivateResultsListService } from '../../data-access/';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateResultsListService],
    loadChildren: () =>
      import('../results-list/results-list.module').then(
        (m) => m.ResultsListModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    CanActivateResultsListService,
    AuthorizationService,
    RedirectService,
  ],
  exports: [RouterModule],
})
export class ResultsShellRoutingModule {}
