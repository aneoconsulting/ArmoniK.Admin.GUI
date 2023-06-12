import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TasksStatusesService } from '@app/tasks/services/task-status.service';
import { StatusCount } from '@app/tasks/types';
import { TasksStatusesGroup } from '../types';

@Component({
  selector: 'app-statuses-group-card',
  template: `
<mat-card>
  <mat-card-header *ngIf="!hideGroupHeaders">
    <mat-card-title>
      <span [style]="'color:' + group.color">
        {{ group.name }}
      </span>
      <span>
        {{ sumStatusCount(group.statuses) }}
      </span>
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <ul>
      <li *ngFor="let status of group.statuses">
        <span>
          {{ statusToLabel(status) }}
        </span>
        <span>
          {{ updateCounter(status) }}
        </span>
      </li>
    </ul>
  </mat-card-content>
</mat-card>
  `,
  styles: [`
mat-card {
  height: 100%;
}

mat-card-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

ul li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
  `],
  standalone: true,
  providers: [
    TasksStatusesService,
  ],
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
  ]
})
export class StatusesGroupCardComponent {
  @Input({ required: true }) group: TasksStatusesGroup;
  @Input({ required: true }) hideGroupHeaders: boolean;
  @Input({ required: true }) data: StatusCount[] = [];

  #tasksStatusesService = inject(TasksStatusesService);

  statusToLabel(status: TaskStatus): string {
    return this.#tasksStatusesService.statusToLabel(status);
  }

  updateCounter(status: TaskStatus): number {
    const counter = this.data.find((statusCount) => statusCount.status === status);
    return counter?.count ?? 0;
  }

  sumStatusCount(status: TaskStatus[]): number {
    return this.data.reduce((acc, curr) => {
      if (status.includes(curr.status)) {
        return acc + curr.count;
      }

      return acc;
    }, 0);
  }
}
