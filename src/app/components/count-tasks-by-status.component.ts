import { Component, Input, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { StatusCount, TaskSummaryFiltersOr } from '@app/tasks/types';
import { TaskStatusColored } from '@app/types/dialog';
import { ViewTasksByStatusComponent } from '@components/view-tasks-by-status.component';

@Component({
  selector: 'app-count-tasks-by-status',
  template: `
<app-view-tasks-by-status
  [statuses]="statuses"
  [loading]="loading"
  [statusesCounts]="statusesCounts"
  [defaultQueryParams]="queryParams"
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
export class CountTasksByStatusComponent implements OnDestroy {
  @Input({ required: true }) statuses: TaskStatusColored[] = [];
  @Input({ required: true }) queryParams: Record<string, string> = {};

  statusesCounts: StatusCount[] | null = null;

  loading = true;

  #tasksGrpcService = inject(TasksGrpcService);

  subscription = new Subscription();

  private _filters: TaskSummaryFiltersOr;
  get filters(): TaskSummaryFiltersOr {
    return this._filters;
  }

  @Input({required: true}) set filters(entries: TaskSummaryFiltersOr) {
    this.statusesCounts = null;
    this._filters = entries;
    this.subscription.add(
      this.#tasksGrpcService.countByStatus$(this.filters).subscribe(response => {
        this.loading = false;
        this.statusesCounts = response.status ?? null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
