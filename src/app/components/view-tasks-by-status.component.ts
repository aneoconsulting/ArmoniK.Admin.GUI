
import { FilterStatusOperator, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { StatusCount } from '@app/tasks/types';
import { TaskStatusColored } from '@app/types/dialog';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-view-tasks-by-status',
  template: `
<app-spinner *ngIf="loading; else data"></app-spinner>

<ng-template #data>
  <ng-container *ngFor="let task of tasks; let index = index; trackBy:trackByCount">
    <a mat-button
      [matTooltip]="task.tooltip"
      [routerLink]="['/tasks']"
      [queryParams]="task.queryParams"
      [style]="'color: ' + task.color"
    >
      {{ task.statusCount }}
    </a>
    <span *ngIf="index !== statuses.length - 1">|</span>
  </ng-container>
</ng-template>
    `,
  styles: [`
.mdc-button {
  min-width: 0;
}
    `],
  standalone: true,
  providers: [
    TasksStatusesService
  ],
  imports: [
    NgIf,
    NgFor,
    RouterModule,
    SpinnerComponent,
    MatTooltipModule,
    MatButtonModule,
  ],
})
export class ViewTasksByStatusComponent {
  tasks: Required<TaskStatusColored>[] = [];
  readonly #tasksStatusesService = inject(TasksStatusesService);

  @Input({ required: true }) loading = true;
  @Input({ required: true }) statuses: TaskStatusColored[] = [];
  @Input({ required: true }) defaultQueryParams: Record<string, string> = {};

  @Input({ required: true }) set statusesCounts(entries: StatusCount[] | null) {
    this.buildTasks(entries);
  }

  createQueryParams(status: TaskStatus): Record<string, string> {
    const taskStatusQueryParams = this.#createQueryParamsStatusKey(status);
    return {
      ...this.defaultQueryParams,
      ...taskStatusQueryParams
    };
  }

  #createQueryParamsStatusKey(status: TaskStatus): Record<string, string> {
    const filterGroup = Object.keys(this.defaultQueryParams).map(keys => keys[0]); // The first character of the key represents the filter "Or Group"

    const taskStatusQueryParams: Record<string, string> = {};
    filterGroup.forEach(groupId => {
      taskStatusQueryParams[`${groupId}-root-${TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS}-${FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL}`] = status.toString();
    });

    return taskStatusQueryParams;
  }

  tooltip(status: TaskStatus): string {
    const statusLabel = this.#tasksStatusesService.statusToLabel(status);

    return statusLabel;
  }

  buildTasks(statusesCounts: StatusCount[] | null): void {
    this.tasks = [];

    this.statuses.forEach(status => {
      const task: Required<TaskStatusColored> = {
        status: status.status,
        color: status.color,
        tooltip: this.tooltip(status.status),
        queryParams:  this.createQueryParams(status.status),
        statusCount: 0
      };

      statusesCounts?.forEach(statusCount => {
        if (statusCount.status === status.status) { 
          task.statusCount = statusCount.count;
          return;
        }
      });

      this.tasks.push(task);
    });
  }

  trackByCount(_: number, status: TaskStatusColored): TaskStatus {
    return status.status;
  }
}
