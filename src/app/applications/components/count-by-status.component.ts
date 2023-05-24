import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { TaskStatusService } from '@app/tasks/services/task-status.service';
import { SpinnerComponent } from '@components/spinner.component';
import { ApplicationsGrpcService } from '../services/applications-grpc.service';
import { StatusCount } from '../types';

@Component({
  selector: 'app-count-by-status',
  template: `
<ng-container *ngIf="statusCount; else noStatus">
  <ng-container *ngFor="let status of statusCount; let index = index">
    <span [matTooltip]="countTooltip(status)">
      <span>
        {{ status.count }}
      </span>
      <span *ngIf="index < statusCount.length - 1">/ </span>
    </span>
  </ng-container>
</ng-container>

<ng-container *ngIf="loading">
  <app-spinner></app-spinner>
</ng-container>

<ng-template #noStatus>
  <em *ngIf="!loading" i18n>No tasks</em>
</ng-template>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    TaskStatusService
  ],
  imports: [
    NgIf,
    NgFor,
    SpinnerComponent,
    MatTooltipModule,
  ]
})
export class CountByStatusComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) name: string;
  @Input({ required: true }) version: string;

  statusCount: StatusCount[] | null = null;
  loading = true;

  #applicationsGrpcService = inject(ApplicationsGrpcService);
  #taskStatusService = inject(TaskStatusService);

  subscriptions = new Subscription();

  ngAfterViewInit(): void {
    const subscription = this.#applicationsGrpcService.countByStatus$(this.name, this.version)
      .subscribe((response) => {
        this.loading = false;
        this.statusCount = response.status ?? null;
      });

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  countTooltip(status: StatusCount): string {
    const statusLabel = this.#taskStatusService.statusToLabel(status.status);

    if (status.count === 1) {
      return `Task with status '${statusLabel}'`;
    }

    return `Tasks with status '${statusLabel}'`;
  }
}
