import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardIndexService } from '../services/dashboard-index.service';
import { StatusCount, TasksStatusGroup } from '../types';

@Component({
  selector: 'app-status-group-card',
  template: `
<mat-card>
  <mat-card-header *ngIf="!hideGroupHeaders">
    <mat-card-title>
      <span [style]="'color:' + group.color">
        {{ group.name }}
      </span>
      <span>
        {{ sumStatusCount(group.status) }}
      </span>
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <ul>
      <li *ngFor="let status of group.status">
        <span>
          {{ getStatusLabel(status) }}
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
  providers: [],
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
  ]
})
export class StatusGroupCardComponent {
  @Input({ required: true }) group: TasksStatusGroup;
  @Input({ required: true }) hideGroupHeaders: boolean;
  @Input({ required: true }) data: StatusCount[] = [];

  #dashboardIndexService = inject(DashboardIndexService);

  getStatusLabel(status: TaskStatus): string {
    return this.#dashboardIndexService.getStatusLabel(status);
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
