import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersMeComponent } from './users-me.page';

const routes: Routes = [
  {
    path: '',
    title: 'My Profile',
    component: UsersMeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersMeRoutingModule {}
