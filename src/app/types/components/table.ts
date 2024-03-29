import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, catchError, of, switchMap } from 'rxjs';
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

@Component({
  selector: 'app-results-table',
  template: '',
})
export abstract class AbstractTableComponent<R extends DataRaw, C extends RawColumnKey, O extends IndexListOptions, F extends RawFilters> implements AfterViewInit {
  @Input({required: true}) displayedColumns: TableColumn<C>[] = [];
  @Input({required: true}) options: O;
  @Input({ required: true }) filters: F;
  @Input({required: true}) refresh$: Subject<void>;
  @Input({ required: true }) loading$: Subject<boolean>;
  @Input() lockColumns = false;

  @Output() optionsChange = new EventEmitter<never>();
  
  data: ArmonikData<R>[] = [];
  total: number = 0;

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  abstract _grpcService: GrpcService;
  abstract readonly indexService: IndexServiceInterface<C, O>;
  readonly filtersService = inject(FiltersService);
  readonly notificationService = inject(NotificationService);

  list$(options: O, filters: F): Observable<GrpcResponse> {
    return this._grpcService.list$(
      options as TaskSummaryListOptions & SessionRawListOptions & ApplicationRawListOptions & ResultRawListOptions & PartitionRawListOptions,
      filters as SessionRawFilters & TaskSummaryFilters & PartitionRawFilters & ApplicationRawFilters & ResultRawFilters
    );
  }

  ngAfterViewInit(): void {
    this.refresh$.pipe(
      switchMap(
        () => {
          this.loading$.next(true);
          const options = structuredClone(this.options);
          const filters = structuredClone(this.filters);

          return this.list$(options, filters).pipe(
            catchError(err => {
              console.error(err);
              this.notificationService.error(err);
              return of(null);
            })
          );
        })
    ).subscribe(entries => {
      this.loading$.next(false);
      if (entries) {
        this.total = entries.total;
        const data = this.computeGrpcData(entries) ?? [];
        this.newData(data);
      }
    });
    this.refresh$.next();
  }

  private newData(entries: R[]) {
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
    this.optionsChange.emit();
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