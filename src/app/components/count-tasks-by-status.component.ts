import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
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
  [statusesCount]="statusesCount()"
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
export class CountTasksByStatusComponent implements OnInit {
  @Input({ required: true }) queryParams: Record<string, string> = {};
  @Input({ required: true }) set refresh(subject: Subject<void>) {
    this._refresh$ = subject;
    this.initRefresh();
  }

  @Input({ required: true }) set statusesGroups(entries: TasksStatusesGroup[]) {
    this._statusesGroups = entries;
    if (this.refresh) {
      this._refresh$.next();
    }
  }

  id: string | undefined;
  private _statusesGroups: TasksStatusesGroup[] = [];
  private _filters: TaskSummaryFilters;
  private _refresh$: Subject<void>;

  get statusesGroups(): TasksStatusesGroup[] {
    return this._statusesGroups;
  }

  get filters(): TaskSummaryFilters {
    return this._filters;
  }

  statusesCount: WritableSignal<StatusCount[]> = signal([]);

  loading = true;

  private readonly tasksGrpcService = inject(TasksGrpcService);

  subscription = new Subscription();

  @Input({ required: true }) set filters(entries: TaskSummaryFilters) {
    this._filters = entries;
    this._refresh$.next();
  }

  ngOnInit(): void {
    this.initCount();
  }

  initCount() {
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
