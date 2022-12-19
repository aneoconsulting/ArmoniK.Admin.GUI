import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsListComponent } from './applications-list.page';

const routes: Routes = [
  {
    path: '',
    component: ApplicationsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsListRoutingModule {}
