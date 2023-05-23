import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { ApplicationsGrpcService } from '../services/applications-grpc.service';
import { StatusCount } from '../types';

@Component({
  selector: 'app-count-by-status',
  template: `
<ng-container *ngIf="statusCount; else noStatus">
  <ng-container *ngFor="let status of statusCount; let index = index">
    <!-- TODO: Convert status to string (could create a service in order to have access from outside (see dashboard-index.service) -->
    <span [matTooltip]="countTooltip(status.status)">
      <span>
        {{ status.count }}
      </span>
      <span *ngIf="index < statusCount.length - 1">/ </span>
    </span>
  </ng-container>
</ng-container>

<ng-container *ngIf="loading">
  <!-- TODO: Create a component for small loader -->
  <mat-spinner diameter="30" strokeWidth="4"></mat-spinner>
</ng-container>

<ng-template #noStatus>
  <em *ngIf="!loading">No tasks</em>
</ng-template>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
  ],
  imports: [
    NgIf,
    NgFor,
    MatTooltipModule,
    MatProgressSpinnerModule
  ]
})
export class CountByStatusComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) name: string;
  @Input({ required: true }) version: string;

  statusCount: StatusCount[] | null = null;
  loading = true;

  #applicationsGrpcService = inject(ApplicationsGrpcService);

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

  countTooltip(status: TaskStatus): string {
    return `Task(s) with status '${status}'`;
  }
}
