import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IndexComponent } from './index.component';

export const APPLICATIONS_ROUTES: Route[] = [
  { path: '', component: IndexComponent },
];

@NgModule({
  imports: [RouterModule.forChild(APPLICATIONS_ROUTES)],
  exports: [RouterModule]
})
export class ApplicationRouterModule {}