import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, catchError, map, merge, of, switchMap } from 'rxjs';
import { FiltersEnums, FiltersOptionsEnums, ManageGroupsDialogData, ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TaskSummaryFilters } from '@app/tasks/types';
import { ManageGroupsDialogComponent } from '@components/statuses/manage-groups-dialog.component';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { TableColumn } from '../column.type';
import { Scope } from '../config';
import { ArmonikData, DataRaw, GrpcResponse, IndexListOptions, RawColumnKey } from '../data';
import { FiltersOr } from '../filters';
import { DataFieldKey, GrpcTableService } from '../services/grpcService';
import { IndexServiceInterface } from '../services/indexService';

export interface SelectableTable<D extends DataRaw> {
  selection: SelectionModel<string>;
  isAllSelected(): boolean;
  toggleAllRows(): void;
  checkboxLabel(row?: ArmonikData<D>): string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface AbstractTableComponent<R extends DataRaw, C extends RawColumnKey, D extends DataFieldKey, O extends IndexListOptions, F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> {
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
export abstract class AbstractTableComponent<R extends DataRaw, C extends RawColumnKey, D extends DataFieldKey, O extends IndexListOptions, F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> {
  @Input({ required: true }) displayedColumns: TableColumn<C>[] = [];
  @Input({ required: true }) options: O;
  @Input({ required: true }) filters$: Subject<FiltersOr<F, FO>>;
  @Input({ required: true }) refresh$: Subject<void>;
  @Input({ required: true }) loading$: Subject<boolean>;
  @Input() lockColumns = false;
  
  data: ArmonikData<R>[] = [];
  total: number = 0;
  filters: FiltersOr<F, FO> = [] as FiltersOr<F, FO>;

  abstract scope: Scope;

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  abstract readonly grpcService: GrpcTableService<D, O, F, FO>;
  abstract readonly indexService: IndexServiceInterface<C, O>;
  readonly cacheService = inject(CacheService);
  readonly filtersService = inject(FiltersService);
  readonly notificationService = inject(NotificationService);

  initTable() {
    this.loadFromCache();
  }

  loadFromCache() {
    const cachedResponse = this.cacheService.get(this.scope);
    if (cachedResponse) {
      const cachedData = this.computeGrpcData(cachedResponse);
      this.total = cachedResponse.total;
      if (cachedData) {
        this.newData(cachedData);
      }
    }
  }

  list$(options: O, filters: FiltersOr<F, FO>): Observable<GrpcResponse> {
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
          this.loading$.next(true);
          const options = structuredClone(this.options);
          const filters = structuredClone(this.filters);

          if (this.prepareBeforeFetching) {
            this.prepareBeforeFetching(options, filters);
          }

          return this.list$(options, filters).pipe(
            catchError(err => {
              console.error(err);
              this.notificationService.error(err);
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
        this.loading$.next(false);
      }
    });
    this.refresh$.next();
  }

  protected newData(entries: R[]) {
    if (entries.length !== 0) {
      this.data = this.data.filter(d => entries.find(entry => this.isDataRawEqual(entry, d.raw)));
      entries.forEach((entry, index) => {
        const value = this.data[index];
        if (!value || !this.isDataRawEqual(value.raw, entry)) {
          this.data.splice(index, 1, this.createNewLine(entry));
        }
      });
    } else {
      this.data = [];
    }
  }

  onDrop(columnsKeys: C[]) {
    this.indexService.saveColumns(columnsKeys);
  }

  onOptionsChange() {
    this.refresh$.next();
  }

  abstract computeGrpcData(entries: GrpcResponse): R[] | undefined;
  abstract isDataRawEqual(value: R, entry: R): boolean;
  abstract createNewLine(entry: R): ArmonikData<R>;
}

@Component({
  selector: 'app-results-table',
  template: '',
})
export abstract class AbstractTaskByStatusTableComponent<R extends DataRaw, C extends RawColumnKey, D extends DataFieldKey, O extends IndexListOptions, F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null>
  extends AbstractTableComponent<R, C, D, O, F, FO> {
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