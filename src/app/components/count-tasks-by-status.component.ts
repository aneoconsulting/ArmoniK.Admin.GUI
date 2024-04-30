import { Component, Input, inject } from '@angular/core';
import { Subject, Subscription, switchMap } from 'rxjs';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { StatusCount, TaskSummaryFilters } from '@app/tasks/types';
import { TaskStatusColored } from '@app/types/dialog';
import { ViewTasksByStatusComponent } from '@components/view-tasks-by-status.component';

@Component({
  selector: 'app-count-tasks-by-status',
  template: `
<app-view-tasks-by-status
  [defaultQueryParams]="queryParams"
  [statuses]="statuses"
  [loading]="loading"
  [statusesCounts]="statusesCounts"
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

  @Input({ required: true }) set statuses(entries: TaskStatusColored[]) {
    this._statuses = entries;
    if (this.refresh) {
      this.refresh.next();
    }
  }

  private _statuses: TaskStatusColored[] = [];

  get statuses(): TaskStatusColored[] {
    return this._statuses;
  }

  statusesCounts: StatusCount[] | null = null;

  loading = true;

  #tasksGrpcService = inject(TasksGrpcService);

  subscription = new Subscription();

  @Input({ required: true }) set filters(entries: TaskSummaryFilters) {
    this.statusesCounts = null;
    this._filters = entries;
    this.refresh.pipe(
      switchMap(() => this.#tasksGrpcService.countByStatus$(this.filters))
    ).subscribe(response => {
      this.loading = false;
      this.statusesCounts = response.status ?? null;
    });
    this.refresh.next();
  }

  private _filters: TaskSummaryFilters;

  get filters(): TaskSummaryFilters {
    return this._filters;
  }
}
