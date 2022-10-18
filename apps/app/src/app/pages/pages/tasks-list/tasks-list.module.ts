import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { TasksListRoutingModule } from './tasks-list-routing.module';
import { TasksListComponent } from './tasks-list.component';

/**
 * Tasks list module
 */
@NgModule({
  declarations: [TasksListComponent],
  imports: [SharedModule, TasksListRoutingModule],
})
export class TasksListModule {}
