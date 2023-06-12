import { AfterViewInit, Component, Input, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksStatusesService } from '@app/tasks/services/task-status.service';
import { ViewTasksByStatusComponent } from '@components/view-tasks-by-status.component';
import { ApplicationsGrpcService } from '../services/applications-grpc.service';
import { StatusCount } from '../types';

@Component({
  selector: 'app-applications-count-by-status',
  template: `
<app-view-tasks-by-status
  [loading]="loading"
  [statusesCounts]="statusCount"
  [defaultQueryParams]="{
    applicationName: name,
    applicationVersion: version,
  }"
  >
</app-view-tasks-by-status>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    TasksStatusesService,
  ],
  imports: [
    ViewTasksByStatusComponent,
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
}
