import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, WritableSignal, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, catchError, map, of, switchMap } from 'rxjs';
import { ApplicationRawFilters, ApplicationRawListOptions } from '@app/applications/types';
import { PartitionRawFilters, PartitionRawListOptions } from '@app/partitions/types';
import { ResultRawFilters, ResultRawListOptions } from '@app/results/types';
import { SessionRawFilters, SessionRawListOptions } from '@app/sessions/types';
import { TaskSummaryFilters, TaskSummaryListOptions } from '@app/tasks/types';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { TableColumn } from '../column.type';
import { ArmonikData, DataRaw, GrpcResponse, IndexListOptions, RawColumnKey } from '../data';
import { TaskStatusColored, ViewTasksByStatusDialogData } from '../dialog';
import { RawFilters } from '../filters';
import { GrpcService } from '../services';
import { IndexServiceInterface } from '../services/indexService';

export interface SelectableTable<D extends DataRaw> {
  selection: SelectionModel<string>;
  isAllSelected(): boolean;
  toggleAllRows(): void;
  checkboxLabel(row?: ArmonikData<D>): string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface AbstractTableComponent<R extends DataRaw, C extends RawColumnKey, O extends IndexListOptions, F extends RawFilters> {
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
export abstract class AbstractTableComponent<R extends DataRaw, C extends RawColumnKey, O extends IndexListOptions, F extends RawFilters> {
  @Input({ required: true }) displayedColumns: TableColumn<C>[] = [];
  @Input({ required: true }) options: O;
  @Input({ required: true }) filters$: Subject<F>;
  @Input({ required: true }) refresh$: Subject<void>;
  @Input({ required: true }) loading: WritableSignal<boolean>;
  @Input() lockColumns = false;
  
  data: ArmonikData<R>[] = [];
  total: number = 0;
  filters: F = [] as unknown as F;

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  abstract readonly grpcService: GrpcService;
  abstract readonly indexService: IndexServiceInterface<C, O>;
  readonly filtersService = inject(FiltersService);
  readonly notificationService = inject(NotificationService);

  list$(options: O, filters: F): Observable<GrpcResponse> {
    return this.grpcService.list$(
      options as TaskSummaryListOptions & SessionRawListOptions & ApplicationRawListOptions & ResultRawListOptions & PartitionRawListOptions,
      filters as SessionRawFilters & TaskSummaryFilters & PartitionRawFilters & ApplicationRawFilters & ResultRawFilters
    );
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
    this.refresh$.next();
  }

  protected newData(entries: R[]) {
    if (entries.length !== 0) {
      this.data = this.data.filter(d => entries.find(entry => this.isDataRawEqual(entry, d.raw)));
      entries.forEach((entry, index) => {
        const value = this.data[index];
        if (value && this.isDataRawEqual(value.raw, entry)) {
          this.data[index].value$?.next(entry);
        } else {
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
export abstract class AbstractTaskByStatusTableComponent<R extends DataRaw, C extends RawColumnKey, O extends IndexListOptions, F extends RawFilters> extends AbstractTableComponent<R, C, O, F> implements OnInit {
  readonly tasksByStatusService = inject(TasksByStatusService);
  readonly dialog = inject(MatDialog);

  tasksStatusesColored: TaskStatusColored[] = [];
  abstract table: TableTasksByStatus;

  ngOnInit(): void {
    this.tasksStatusesColored = this.tasksByStatusService.restoreStatuses(this.table);
  }

  personalizeTasksByStatus() {
    const dialogRef = this.dialog.open<ViewTasksByStatusDialogComponent, ViewTasksByStatusDialogData>(ViewTasksByStatusDialogComponent, {
      data: {
        statusesCounts: this.tasksStatusesColored,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksStatusesColored = result;
        this.tasksByStatusService.saveStatuses(this.table, result);
      }
    });
  }

  abstract countTasksByStatusFilters(...ids: string[]): TaskSummaryFilters;
}