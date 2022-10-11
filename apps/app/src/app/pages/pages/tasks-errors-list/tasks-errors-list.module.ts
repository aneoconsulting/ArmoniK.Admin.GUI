import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { TasksListRoutingModule } from '../tasks-list/tasks-list-routing.module';
import { TasksErrorsListComponent } from './tasks-errors-list.component';

/**
 * Tasks errors list module
 */
@NgModule({
  declarations: [TasksErrorsListComponent],
  imports: [SharedModule, TasksListRoutingModule],
})
export class TasksErrorsListModule {}
