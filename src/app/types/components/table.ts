import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { TaskSummaryFilters } from '@app/tasks/types';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { FiltersService } from '@services/filters.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { TableColumn } from '../column.type';
import { ArmonikData, DataRaw, IndexListOptions, RawColumnKey } from '../data';
import { TaskStatusColored, ViewTasksByStatusDialogData } from '../dialog';
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
export abstract class AbstractTableComponent<R extends DataRaw, C extends RawColumnKey, O extends IndexListOptions> implements AfterViewInit {
  @Input({required: true}) displayedColumns: TableColumn<C>[] = [];
  @Input({required: true}) options: O;
  @Input({required: true}) total: number;
  @Input() lockColumns = false;
  @Input({required: true}) data$: Subject<R[]>;

  @Output() optionsChange = new EventEmitter<never>();
  
  protected _data: ArmonikData<R>[] = [];
  readonly dataSource = new MatTableDataSource<ArmonikData<R>>(this._data);

  get data(): ArmonikData<R>[] {
    return this._data;
  }

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  abstract readonly indexService: IndexServiceInterface<C, O>;
  readonly filtersService = inject(FiltersService);

  ngAfterViewInit(): void {
    this.data$.subscribe(entries => this.newData(entries));
  }

  private newData(entries: R[]) {
    if (entries.length !== 0) {
      this._data = this.data.filter(d => entries.find(entry => this.isDataRawEqual(entry, d.raw)));
      entries.forEach((entry, index) => {
        const value = this._data[index];
        if (value && this.isDataRawEqual(value.raw, entry)) {
          this._data[index].value$?.next(entry);
        } else {
          this._data.splice(index, 1, this.createNewLine(entry));
        }
      });
      this.dataSource.data = this._data;
    } else {
      this._data = [];
      this.dataSource.data = this._data;
    }
  }

  onDrop(columnsKeys: C[]) {

    this.indexService.saveColumns(columnsKeys);
  }

  onOptionsChange() {
    this.optionsChange.emit();
  }

  abstract isDataRawEqual(value: R, entry: R): boolean;
  abstract createNewLine(entry: R): ArmonikData<R>;
}

@Component({
  selector: 'app-results-table',
  template: '',
})
export abstract class AbstractTaskByStatusTableComponent<R extends DataRaw, C extends RawColumnKey, O extends IndexListOptions> extends AbstractTableComponent<R, C, O> implements OnInit {
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