import { Component, Input, inject } from '@angular/core';
import { Subject, Subscription, switchMap } from 'rxjs';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { StatusCount, TaskSummaryFilters } from '@app/tasks/types';
import { ViewTasksByStatusComponent } from '@components/view-tasks-by-status.component';

@Component({
  selector: 'app-count-tasks-by-status',
  template: `
<app-view-tasks-by-status
  [defaultQueryParams]="queryParams"
  [loading]="loading"
  [statusesGroups]="statusesGroups"
  [statusesCount]="statusesCount"
>
</app-view-tasks-by-status>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    TasksGrpcService,
    TasksFiltersService
  ],
  imports: [
    ViewTasksByStatusComponent,
  ]
})
export class CountTasksByStatusComponent {
  @Input({ required: true }) queryParams: Record<string, string> = {};
  @Input({ required: true }) refresh: Subject<void>;

  @Input({ required: true }) set statusesGroups(entries: TasksStatusesGroup[]) {
    this._statusesGroups = entries;
    if (this.refresh) {
      this.refresh.next();
    }
  }

  private _statusesGroups: TasksStatusesGroup[] = [];

  get statusesGroups(): TasksStatusesGroup[] {
    return this._statusesGroups;
  }

  statusesCount: StatusCount[] | null = [];

  loading = true;

  #tasksGrpcService = inject(TasksGrpcService);

  subscription = new Subscription();

  @Input({ required: true }) set filters(entries: TaskSummaryFilters) {
    this.refresh.pipe(
      switchMap(() => this.#tasksGrpcService.countByStatus$(entries)),
    ).subscribe(response => {
      this.loading = false;
      this.statusesCount = response.status ?? null;
    });
    this.refresh.next();
  }
}
