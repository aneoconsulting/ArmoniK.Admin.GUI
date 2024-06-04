
import { FilterStatusOperator, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, WritableSignal, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { StatusCount } from '@app/tasks/types';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-view-tasks-by-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<app-spinner *ngIf="loading(); else data"></app-spinner>

<ng-template #data>
  <ng-container *ngFor="let group of statusesGroups; let index = index;">
    <a mat-button
      [matTooltip]="group.name"
      [routerLink]="['/tasks']"
      [queryParams]="group.queryParams"
      [style]="'color: ' + group.color"
    >
      {{ group.statusCount ?? 0 }}
    </a>
    <span *ngIf="index !== statusesGroups.length - 1">|</span>
  </ng-container>
</ng-template>
    `,
  styles: [`
.mdc-button {
  min-width: 0;
}
    `],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterModule,
    SpinnerComponent,
    MatTooltipModule,
    MatButtonModule
  ],
})
export class ViewTasksByStatusComponent {
  @Input({ required: true }) loading: WritableSignal<boolean> = signal(true);
  @Input({ required: true }) defaultQueryParams: Record<string, string> = {};

  @Input() set statusesGroups(entries: TasksStatusesGroup[]) {
    this._statusesGroups = entries.map(group => this.completeGroup(group));
  }

  private _statusesGroups: TasksStatusesGroup[] = [];

  get statusesGroups(): TasksStatusesGroup[] {
    return this._statusesGroups;
  }

  @Input() set statusesCount(entries: StatusCount[] | null) {
    this.statusesGroups.forEach(group => group.statusCount = 0);
    entries?.forEach((entry) => {
      this.statusesGroups.forEach(group => {
        if (group.statuses.includes(entry.status) && group.statusCount !== undefined) {
          group.statusCount += entry.count;
        }
      });
    });
  }

  createQueryParams(group: TasksStatusesGroup) {
    const queryOrs = Object.keys(this.defaultQueryParams).map(key => key[0]).filter((key, index, self) => self.indexOf(key) === index);
    const queryParamsKeys = Object.keys(this.defaultQueryParams);
    const queryParamsValues = Object.values(this.defaultQueryParams);
    const taskStatusQueryParams: Record<string, string> = {};
    let orGroups = 0;

    if (queryOrs.length !== 0) {
      queryOrs.forEach(or => {
        group.statuses.forEach(status => {
          taskStatusQueryParams[this.#createQueryParamKeyOr(orGroups)] = status.toString();
          queryParamsKeys.forEach((key, index) => {
            if (key.startsWith(or)) {
              taskStatusQueryParams[`${orGroups}${key.slice(1)}`] = queryParamsValues[index];
            }
          });
          orGroups++;
        });
      });
    } else {
      group.statuses.forEach((status, index) => {
        taskStatusQueryParams[this.#createQueryParamKeyOr(index)] = status.toString();
      });
    }
    
    return taskStatusQueryParams;
  }

  #createQueryParamKeyOr(index: number) {
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
