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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [TaskDetailResolver],
  exports: [RouterModule],
})
export class SessionDetailRoutingModule {}
