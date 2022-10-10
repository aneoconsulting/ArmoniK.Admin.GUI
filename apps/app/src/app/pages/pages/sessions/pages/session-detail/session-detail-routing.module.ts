import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskDetailComponent } from './pages';
import { TaskDetailResolver } from './services/';
import { SessionDetailComponent } from './session-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SessionDetailComponent,
  },
  {
    path: 'tasks/:task',
    component: TaskDetailComponent,
    resolve: {
      task: TaskDetailResolver,
    },
  },
  {
    path: 'tasks/:task/results',
    loadChildren: () =>
      import('./pages/task-results/task-results.module').then(
        (m) => m.TaskResultsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [TaskDetailResolver],
  exports: [RouterModule],
})
export class SessionDetailRoutingModule {}
