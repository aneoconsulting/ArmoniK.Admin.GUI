import { Component, Input } from '@angular/core';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions, TaskSummaryFilters } from '@app/tasks/types';
import { ApplicationData, ArmonikData, DataRaw, PartitionData, SessionData } from '@app/types/data';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-group-tasks-by-status',
  templateUrl: 'group-tasks-by-status.component.html',
  standalone: true,
  imports: [
    CountTasksByStatusComponent,
  ]
})
export class GroupTasksByStatusComponent<T extends DataRaw, O extends TaskOptions | null = null> {
  @Input({ required: true }) set groupData(entry: ArmonikData<T, O>[] | null) {
    if (entry !== null) {
      this.filters = [];
      this.queryParams = {};
      const groupData = entry as unknown as (SessionData | ApplicationData | PartitionData)[];
      groupData.forEach((data) => {
        this.filters.push(...data.filters);
      });
  
      groupData.forEach((data, index) => {
        const keys = Object.keys(data.queryTasksParams);
        keys.forEach((key) => (this.queryParams[`${index}${key.slice(1)}`] = data.queryTasksParams[key]));
      });
      this.queryParamsLength = Object.keys(this.queryParams).length;
    }
  }

  @Input({ required: true }) statusesGroups: TasksStatusesGroup[];

  filters: TaskSummaryFilters;
  queryParams: Record<string, string>;
  queryParamsLength = 0;
  refresh = new Subject<void>();
}