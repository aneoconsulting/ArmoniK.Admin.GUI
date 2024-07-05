import { Component, Input, WritableSignal, inject, signal } from '@angular/core';
import { Subject, Subscription, switchMap } from 'rxjs';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { StatusCount, TaskSummaryFilters } from '@app/tasks/types';
import { ViewTasksByStatusComponent } from '@components/view-tasks-by-status.component';
import { CacheService } from '@services/cache.service';

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
export class CountTasksByStatusComponent {
  @Input({ required: true }) queryParams: Record<string, string> = {};
  @Input({ required: true }) refresh: Subject<void>;

  @Input({ required: true }) set statusesGroups(entries: TasksStatusesGroup[]) {
    this._statusesGroups = entries;
    if (this.refresh) {
      this.refresh.next();
    }
  }

  id: string | undefined;
  private _statusesGroups: TasksStatusesGroup[] = [];

  get statusesGroups(): TasksStatusesGroup[] {
    return this._statusesGroups;
  }

  statusesCount: WritableSignal<StatusCount[]> = signal([]);

  loading = true;

  #tasksGrpcService = inject(TasksGrpcService);
  readonly cacheService = inject(CacheService);

  subscription = new Subscription();

  @Input({ required: true }) set filters(entries: TaskSummaryFilters) {
    this.initCount(entries);
    this.refresh.pipe(
      switchMap(() => this.#tasksGrpcService.countByStatus$(entries)),
    ).subscribe(response => {
      this.loading = false;
      this.statusesCount.set(response.status ?? []);
      this.saveData(response.status);
    });
    this.refresh.next();
  }

  initCount(filters: TaskSummaryFilters) {
    this.#setId(filters);
    this.loadFromCache();
  }

  loadFromCache() {
    if (this.id) {
      this.statusesCount.set(this.cacheService.getStatuses(this.id) ?? []);
    }
  }

  saveData(data: StatusCount[] | undefined) {
    if (this.id && data) {
      this.cacheService.saveStatuses(this.id, data);
    }
  }

  #setId(filter: TaskSummaryFilters) {
    if (filter[0]?.[0]?.value) {
      this.id = filter[0][0].value.toString();
    } else {
      this.id = undefined;
    }
  }
}
