import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { TasksListRoutingModule } from './tasks-list-routing.module';
import { TasksListComponent } from './tasks-list.component';

/**./tasks-list.component
 * Tasks page
 */
@NgModule({
  declarations: [TasksListComponent],
  imports: [SharedModule, TasksListRoutingModule],
})
export class TasksListModule {}
