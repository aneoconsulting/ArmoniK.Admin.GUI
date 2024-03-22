import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ResultRawFieldKey } from '@app/results/types';
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
export abstract class AbstractTableComponent<R extends DataRaw, C extends RawColumnKey, O extends IndexListOptions> implements AfterViewInit, AfterContentInit {
  @Input({required: true}) displayedColumns: TableColumn<C>[] = [];
  @Input({required: true}) options: O;
  @Input({required: true}) total: number;
  @Input() lockColumns = false;
  @Input({required: true}) data$: Subject<R[]>;

  @Output() optionsChange = new EventEmitter<never>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  protected _data: ArmonikData<R>[] = [];
  readonly dataSource = new MatTableDataSource<ArmonikData<R>>(this._data);

  get data(): ArmonikData<R>[] {
    return this._data;
  }

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  abstract readonly indexService: IndexServiceInterface<C, O, R>;
  readonly filtersService = inject(FiltersService);

  ngAfterContentInit(): void {
    const data = this.indexService.restoreData();
    this.total = data.length;
    this.newData(data);
  }

  ngAfterViewInit(): void {
    
    this.sort.sortChange.subscribe(() => {
      this.options.pageIndex = 0; // If the user change the sort order, reset back to the first page.
      this.options.sort = {
        active: this.sort.active as ResultRawFieldKey,
        direction: this.sort.direction
      };
      this.optionsChange.emit();
    });

    this.paginator.page.subscribe(() => {
      if (this.options.pageSize > this.paginator.pageSize) this._data = [];
      this.options.pageIndex = this.paginator.pageIndex;
      this.options.pageSize = this.paginator.pageSize;
      this.optionsChange.emit();
    });

    this.data$.subscribe(entries => this.newData(entries));
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this.indexService.saveColumns(this.displayedColumns.map(column => column.key));
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