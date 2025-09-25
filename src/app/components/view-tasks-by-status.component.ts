
import { FilterStatusOperator, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { StatusCount } from '@app/tasks/types';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-view-tasks-by-status',
  templateUrl: 'view-tasks-by-status.component.html',
  styleUrl: 'view-tasks-by-status.component.css',
  imports: [
    RouterModule,
    SpinnerComponent,
    MatTooltipModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTasksByStatusComponent {
  @Input({ required: true }) loading = true;
  @Input({ required: true }) defaultQueryParams: Record<string, string> = {};

  @Input() set statusesGroups(entries: TasksStatusesGroup[]) {
    this._statusesGroups = entries.map(group => this.completeGroup(group));
  }

  private _statusesGroups: TasksStatusesGroup[] = [];

  get statusesGroups(): TasksStatusesGroup[] {
    return this._statusesGroups;
  }

  @Input() set statusesCount(entries: StatusCount[] | null) {
    for (const group of this.statusesGroups) {
      group.statusCount = 0;
    }
    if (entries) {
      for (const entry of entries) {
        for (const group of this.statusesGroups) {
          if (group.statuses.includes(entry.status) && group.statusCount !== undefined) {
            group.statusCount += entry.count;
          }
        }
      }
    }
  }

  createQueryParams(group: TasksStatusesGroup) {
    const queryOrs = Object.keys(this.defaultQueryParams).map(key => key[0]).filter((key, index, self) => self.indexOf(key) === index);
    if (queryOrs.length === 0) {
      return this.createQueryParamsSingleFilter(group);
    } 
    return this.createQueryParamsManyFilters(group, queryOrs);    
  }

  private createQueryParamsSingleFilter(group: TasksStatusesGroup) {
    const taskStatusQueryParams: Record<string, string> = {};
    for (const [index, status] of group.statuses.entries()) {
      taskStatusQueryParams[this.createQueryParamKeyOr(index)] = status.toString();
    }
    return taskStatusQueryParams;
  }

  private createQueryParamsManyFilters(group: TasksStatusesGroup, queryOrs: string[]) {
    const taskStatusQueryParams: Record<string, string> = {};
    const queryParamsKeys = Object.keys(this.defaultQueryParams);
    const queryParamsValues = Object.values(this.defaultQueryParams);
    let orGroups = 0;
    for (const or of queryOrs) {
      for (const status of group.statuses) {
        taskStatusQueryParams[this.createQueryParamKeyOr(orGroups)] = status.toString();
        for (const [index, key] of queryParamsKeys.entries()) {
          if (key.startsWith(or)) {
            taskStatusQueryParams[`${orGroups}${key.slice(1)}`] = queryParamsValues[index];
          }
        }
        orGroups++;
      }
    }
    return taskStatusQueryParams;
  }

  private createQueryParamKeyOr(index: number) {
    return `${index}-root-${TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS}-${FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL}`;
  }

  /**
   * Create a group that can be used by the component by filling its missing fields
   * @param group initial group to transform
   * @returns the complete status
   */
  completeGroup(group: TasksStatusesGroup): TasksStatusesGroup {
    return {
      queryParams: this.createQueryParams(group),
      ...group,
    };
  }
}
