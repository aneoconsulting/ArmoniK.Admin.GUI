import { RouterModule, Routes } from '@angular/router';
import { ApplicationsListComponent } from './applications-list.page';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    title: $localize`Applications List`,
    component: ApplicationsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsListRoutingModule {}
