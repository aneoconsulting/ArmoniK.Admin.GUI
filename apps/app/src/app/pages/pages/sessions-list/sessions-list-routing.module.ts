import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionsListComponent } from './sessions-list.component';

const route: Routes = [
  {
    path: '',
    component: SessionsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class SessionsListRoutingModule {}
