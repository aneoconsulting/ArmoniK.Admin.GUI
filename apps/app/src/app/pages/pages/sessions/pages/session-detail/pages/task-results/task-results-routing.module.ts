import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskResultsComponent } from './task-results.component';

const routes: Routes = [
  {
    path: '',
    component: TaskResultsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskResultsRoutingModule {}
