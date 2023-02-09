import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksListComponent } from './tasks-list.page';

const routes: Routes = [
  {
    path: '',
    title: $localize`Tasks List`,
    component: TasksListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksListRoutingModule {}
