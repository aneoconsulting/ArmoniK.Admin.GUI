import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, WritableSignal, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageGroupsDialogData, ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions, TaskSummaryFilters } from '@app/tasks/types';
import { ManageGroupsDialogComponent } from '@components/statuses/manage-groups-dialog.component';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { Observable, Subject, catchError, first, map, of, switchMap } from 'rxjs';
import { TableColumn } from '../column.type';
import { Scope } from '../config';
import { ArmonikData, ColumnKey, DataRaw, GrpcResponse } from '../data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '../filters';
import { ListOptions } from '../options';
import { GrpcTableService } from '../services/grpcService';
import { IndexServiceInterface } from '../services/indexService';

export interface SelectableTable<D extends DataRaw> {
  selection: SelectionModel<string>;
  isAllSelected(): boolean;
  toggleAllRows(): void;
  checkboxLabel(row?: ArmonikData<D>): string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface AbstractTableComponent<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> {
  /**
   * Modify environment before fetching the data.
   * It is required for computing values that are not directly returned by the API (example: sessions durations).
   * @param options 
   * @param filters 
   */
  prepareBeforeFetching(...args: unknown[]): void;

  /**
   * Call functions required to compute values after fetching the data.
   * @param args 
   */
  afterDataCreation(...args: unknown[]): void;
}

@Component({
  selector: 'app-results-table',
  template: '',
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export abstract class AbstractTableComponent<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> {
  @Input({ required: true }) displayedColumns: TableColumn<T, O>[] = [];
  @Input({ required: true }) options: ListOptions<T, O>;
  @Input({ required: true }) filters$: Subject<FiltersOr<F, FO>>;
  @Input({ required: true }) refresh$: Subject<void>;
  @Input({ required: true }) loading: WritableSignal<boolean>;
  @Input() lockColumns = false;
  
  data: WritableSignal<ArmonikData<T, O>[]> = signal([]);
  total: number = 0;
  filters: FiltersOr<F, FO> = [] as FiltersOr<F, FO>;

  abstract scope: Scope;

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  abstract readonly grpcService: GrpcTableService<T, F, O, FO>;
  abstract readonly indexService: IndexServiceInterface<T, O>;
  readonly cacheService = inject(CacheService);
  readonly filtersService = inject(FiltersService);
  readonly notificationService = inject(NotificationService);

  initTable() {
    this.loadFromCache();
  }

  loadFromCache() {
    this.refresh$.pipe(first()).subscribe(() => {
      const cachedResponse = this.cacheService.get(this.scope);
      if (cachedResponse) {
        const cachedData = this.computeGrpcData(cachedResponse);
        this.total = cachedResponse.total;
        if (cachedData) {
          this.newData(cachedData);
        }
      }
    });
  }

  list$(options: ListOptions<T, O>, filters: FiltersOr<F, FO>): Observable<GrpcResponse> {
    return this.grpcService.list$(options, filters);
  }

  subscribeToData() {
    this.filters$.subscribe(filters => {
      this.filters = filters;
      this.refresh$.next();
    });
    this.refresh$.pipe(
      switchMap(
        () => {
          this.loading.set(true);
          const options = structuredClone(this.options);
          const filters = structuredClone(this.filters);

          if (this.prepareBeforeFetching) {
            this.prepareBeforeFetching(options, filters);
          }

          return this.list$(options, filters).pipe(
            catchError((err: GrpcStatusEvent) => {
              console.error(err);
              this.notificationService.error(`Could not load ${this.scope}`);
              return of(null);
            })
          );
        }),
      map(entries => {
        this.total = entries?.total ?? 0;
        if (entries) {
          this.cacheService.save(this.scope, entries);
          return this.computeGrpcData(entries) ?? [];
        }
        return [];
      })
    ).subscribe(data => {
      if (this.total !== 0 && this.afterDataCreation) {
        this.afterDataCreation(data);
      } else {
        this.newData(data);
        this.loading.set(false);
      }
    });
  }

  protected newData(entries: T[]) {
    this.data.set(entries.map(entry => this.createNewLine(entry)));
  }

  onDrop(columnsKeys: ColumnKey<T, O>[]) {
    this.indexService.saveColumns(columnsKeys);
  }

  onOptionsChange() {
    this.indexService.saveOptions(this.options);
    this.refresh$.next();
  }

  abstract computeGrpcData(entries: GrpcResponse): T[] | undefined;
  abstract isDataRawEqual(value: T, entry: T): boolean;
  abstract createNewLine(entry: T): ArmonikData<T, O>;
  abstract trackBy(index: number, item: ArmonikData<T>): string | number;
}

@Component({
  selector: 'app-results-table',
  template: '',
})
export abstract class AbstractTaskByStatusTableComponent<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null>
  extends AbstractTableComponent<T, F, O, FO> {
  readonly tasksByStatusService = inject(TasksByStatusService);
  readonly dialog = inject(MatDialog);

  statusesGroups: TasksStatusesGroup[];
  abstract table: TableTasksByStatus;

  override initTable(): void {
    this.initStatuses();
    this.loadFromCache();
  }

  initStatuses() {
    this.statusesGroups = this.tasksByStatusService.restoreStatuses(this.table);
  }

  personalizeTasksByStatus() {
    const dialogRef = this.dialog.open<ManageGroupsDialogComponent, ManageGroupsDialogData, ManageGroupsDialogResult>(ManageGroupsDialogComponent, {
      data: {
        groups: [...this.statusesGroups],
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.statusesGroups = result.groups;
        this.tasksByStatusService.saveStatuses(this.table, this.statusesGroups);
      }
    });
  }

  abstract countTasksByStatusFilters(...ids: string[]): TaskSummaryFilters;
}