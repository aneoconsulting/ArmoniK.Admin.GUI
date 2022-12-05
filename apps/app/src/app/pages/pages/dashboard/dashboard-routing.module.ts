import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardApplicationsResolver } from './services';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [DashboardApplicationsResolver],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
