
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
  <ng-container *ngFor="let status of statuses; let index = index; trackBy:trackByCount">
    <a mat-button
      [matTooltip]="status.tooltip"
      [routerLink]="['/tasks']"
      [queryParams]="status.queryParams"
      [style]="'color: ' + status.color"
    >
      {{ status.statusCount }}
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
    MatButtonModule
  ],
})
export class ViewTasksByStatusComponent {
  readonly tasksStatusesService = inject(TasksStatusesService);

  @Input({ required: true }) loading = true;
  @Input({ required: true }) defaultQueryParams: Record<string, string> = {};

  @Input({ required: true }) set statuses(entries: TaskStatusColored[]) {
    const statuses: Required<TaskStatusColored>[] = [];
    entries.forEach(entry => {
      statuses.push(this.completeStatus(entry));
    });
    this._statuses = statuses;
  }

  @Input({ required: true }) set statusesCounts(entries: StatusCount[] | null) {
    if (entries) {
      this.statuses.forEach(status => {
        const statusCount = entries.find(entry => entry.status === status.status);
        status.statusCount = statusCount?.count ?? 0;
      });
    }
  }

  private _statuses: Required<TaskStatusColored>[] = [];

  get statuses(): Required<TaskStatusColored>[] {
    return this._statuses;
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

  /**
   * Create a status that can be used by the component by filling its missing fields
   * @param incompleteStatus initial status to transform
   * @returns the complete status
   */
  completeStatus(incompleteStatus: TaskStatusColored) {
    return {
      status: incompleteStatus.status,
      color: incompleteStatus.color,
      queryParams: this.createQueryParams(incompleteStatus.status),
      tooltip: this.tooltip(incompleteStatus.status),
      statusCount: 0
    };
  }

  tooltip(status: TaskStatus): string {
    const statusLabel = this.tasksStatusesService.statusToLabel(status);
    return statusLabel;
  }

  trackByCount(_: number, status: TaskStatusColored): TaskStatus {
    return status.status;
  }
}
