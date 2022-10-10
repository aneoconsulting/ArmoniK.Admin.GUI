import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../shared';
import { ResultsListComponent } from './components';
import { TaskResultsRoutingModule } from './task-results-routing.module';
import { TaskResultsComponent } from './task-results.component';

@NgModule({
  declarations: [TaskResultsComponent, ResultsListComponent],
  imports: [SharedModule, TaskResultsRoutingModule],
  exports: [],
})
export class TaskResultsModule {}
