import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksErrorsListComponent } from './tasks-errors-list.component';

const routes: Routes = [
  {
    path: '',
    component: TasksErrorsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksErrorsListRoutingModule {}
