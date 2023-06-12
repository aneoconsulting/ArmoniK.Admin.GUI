
import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TasksStatusesService } from '@app/tasks/services/task-status.service';
import { StatusCount } from '@app/tasks/types';
import { SpinnerComponent } from './spinner.component';

type TaskStatusColored = {
  status: TaskStatus;
  color: string;
};

@Component({
  selector: 'app-view-tasks-by-status',
  template: `
<app-spinner *ngIf="loading; else data"></app-spinner>

<ng-template #data>
  <ng-container *ngFor="let status of statuses; let index = index; trackBy:trackByCount">
    <a mat-button
      [matTooltip]="tooltip(status.status)"
      [routerLink]="['/tasks']"
      [queryParams]="createQueryParams(status.status)"
      [style]="'color: ' + status.color"
    >
      {{ findStatusCount(status.status)?.count ?? 0 }}
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
  providers: [],
  imports: [
    NgIf,
    NgFor,
    RouterModule,
    SpinnerComponent,
    MatTooltipModule,
    MatButtonModule,
  ],
})
export class ViewTasksByStatusComponent implements OnInit {
  @Input({ required: true }) loading = true;
  @Input({ required: true }) statusesCounts: StatusCount[] | null = null;
  @Input() defaultQueryParams: Record<string, string> = {};

  #tasksStatusesService = inject(TasksStatusesService);

  statuses: TaskStatusColored[] = [];

  readonly defaultStatuses: TaskStatusColored[] = [
    {
      status: TaskStatus.TASK_STATUS_COMPLETED,
      color: '#4caf50',
    },
    {
      status: TaskStatus.TASK_STATUS_ERROR,
      color: '#ff0000',
    },
    {
      status: TaskStatus.TASK_STATUS_TIMEOUT,
      color: '#ff6944',
    },
    {
      status: TaskStatus.TASK_STATUS_RETRIED,
      color: '#ff9800',
    },
  ];

  ngOnInit(): void {
    this.statuses = this.defaultStatuses;
    // TODO: load data from localStorage (using a input key)
  }

  findStatusCount(status: TaskStatus): StatusCount | undefined {
    return this.statusesCounts?.find((statusCount) => statusCount.status === status);
  }

  createQueryParams(status: TaskStatus): Record<string, string> {
    return {
      ...this.defaultQueryParams,
      status: status.toString(),
    };
  }

  tooltip(status: TaskStatus): string {
    const statusLabel = this.#tasksStatusesService.statusToLabel(status);

    return statusLabel;
  }

  trackByCount(_: number, status: TaskStatusColored): TaskStatus {
    return status.status;
  }
}
