import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionsListComponent } from './sessions-list.page';

const route: Routes = [
  {
    path: '',
    title: $localize`Sessions List`,
    component: SessionsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class SessionsListRoutingModule {}
