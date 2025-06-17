import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { StatusCount, TaskSummaryFilters } from '@app/tasks/types';
import { ViewTasksByStatusComponent } from '@components/view-tasks-by-status.component';
import { Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-count-tasks-by-status',
  template: `
<app-view-tasks-by-status
  [defaultQueryParams]="queryParams"
  [loading]="loading"
  [statusesGroups]="statusesGroups"
  [statusesCount]="statusesCount()"
>
</app-view-tasks-by-status>
  `,
  styles: [`
  `],
  providers: [
    TasksGrpcService,
    TasksFiltersService
  ],
  imports: [
    ViewTasksByStatusComponent,
  ]
})
export class CountTasksByStatusComponent implements OnInit {
  private readonly tasksGrpcService = inject(TasksGrpcService);

  id: string | undefined;
  statusesCount: WritableSignal<StatusCount[]> = signal([]);
  loading = true;

  private _statusesGroups: TasksStatusesGroup[] = [];
  private _filters: TaskSummaryFilters;
  private _refresh$: Subject<void>;

  @Input({ required: true }) queryParams: Record<string, string> = {};

  @Input({ required: true }) set refresh(subject: Subject<void>) {
    this._refresh$ = subject;
    this.initRefresh();
  }

  @Input({ required: true }) set statusesGroups(entries: TasksStatusesGroup[]) {
    this._statusesGroups = entries;
    this._refresh$.next();
  }

  get statusesGroups(): TasksStatusesGroup[] {
    return this._statusesGroups;
  }

  get filters(): TaskSummaryFilters {
    return this._filters;
  }

  @Input({ required: true }) set filters(entries: TaskSummaryFilters) {
    this._filters = entries;
  }

  ngOnInit(): void {
    this.initId();
  }

  initId() {
    this.#setId(this.filters);
  }

  initRefresh() {
    this._refresh$.pipe(
      switchMap(() => this.tasksGrpcService.countByStatus$(this.filters)),
    ).subscribe(response => {
      this.loading = false;
      this.statusesCount.set(response.status ?? []);
    });
  }

  #setId(filter: TaskSummaryFilters) {
    if (filter[0]?.[0]?.value) {
      this.id = filter[0][0].value.toString();
    } else {
      this.id = undefined;
    }
  }
}
