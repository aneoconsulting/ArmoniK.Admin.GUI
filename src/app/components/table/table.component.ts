import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { GrpcAction } from '@app/types/actions.type';
import { TableColumn } from '@app/types/column.type';
import { ArmonikData, ColumnKey, DataRaw } from '@app/types/data';
import { ListOptions } from '@app/types/options';
import { Status, StatusService } from '@app/types/status';
import { TableContainerComponent } from '@components/table-container.component';
import { TableActionsComponent } from './table-actions.component';
import { TableCellComponent } from './table-cell.component';
import { TableColumnHeaderComponent } from './table-column-header.component';

/**
 * Display any kind of ArmoniKData in a [angular material table](https://material.angular.dev/components/table/overview).
 */
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: 'table.component.scss',
  imports: [
    TableColumnHeaderComponent,
    TableCellComponent,
    MatPaginatorModule,
    DragDropModule,
    MatTableModule,
    MatSortModule,
    TableActionsComponent,
    TableContainerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null> implements AfterViewInit, OnDestroy {
  /**
   * Required input. Represents the displayed columns in the table.
   */
  @Input({ required: true }) set columns(entries: TableColumn<T, O>[]) {
    const selectColumn = entries.find(column => column.key === 'select');
    if (selectColumn) {
      entries = [selectColumn, ...entries.filter(column => column.key !== 'select')];
    }
    this._columns = entries;
    this._columnsKeys = entries.map((entry) => entry.key);
  }

  /**
   * Required input. Data to display.
   */
  @Input({ required: true }) set data(entries: ArmonikData<T, O>[]) {
    this._data = entries;
    if (this.dataComparator) {
      const selection = entries.filter(entry => this.isSelected(entry.raw)).map(entry => entry.raw);
      this.selection.clear();
      this.selection.select(...selection);
      this._isAllSelected = this.selection.selected.length === entries.length && entries.length > 0;
      this.emitSelectionChange();
    }
  }

  /**
   * Required input. Total number of this ArmonikData in the database.
   */
  @Input({ required: true }) total: number;

  /**
   * Required input. [ListOptions](src/app/types/options.ts) of the table.
   */
  @Input({ required: true }) options: ListOptions<T, O>;

  /**
   * Required input. If true, the user cannot change columns positions.
   */
  @Input({ required: true }) lockColumns: boolean;

  
  /**
   * Optional input. Actions available on each row.
   */
  @Input({ required: false }) actions: GrpcAction<T>[];

  /**
   * Optional input. Used to display statuses instead of their enumeration.
   */
  @Input({ required: false }) statusesService: StatusService<S>;

  /**
   * Optional input. This input is then forwarded to the [CountTasksByStatusComponent](src/app/components/count-tasks-by-status.component.ts) component.
   */
  @Input({ required: false }) statusesGroups: TasksStatusesGroup[];

  /**
   * Provide a way to compare data, which will be used to know which data is selected and which is not.
   * 
   * For example, for a task, the function will be:
   * 
   * ```typescript
   * function taskComparator(task1: TaskRaw, task2: TaskRaw) {
   *   return task1.id === task2.id;
   * }
   * ```
   */
  @Input({ required: false }) dataComparator: ((a: T, b: T) => boolean) | undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Input({ required: false }) trackBy(index: number, item: ArmonikData<T, O>): number | string {
    return index;
  }

  /**
   * Emits an event when columns position change
   */
  @Output() columnDrop = new EventEmitter<ColumnKey<T, O>[]>();

  /**
   * Emits an event when the user changes page, page size, sort direction or sorted column.
   */
  @Output() optionsChange = new EventEmitter<never>();

  /**
   * Emits an event when the user select a line.
   */
  @Output() selectionChange = new EventEmitter<T[]>();

  /**
   * Emits an event when the user change the displayed statuses in the tasks by statuses component.
   */
  @Output() personalizeTasksByStatus = new EventEmitter<void>();

  /**
   * Observe the paginator in the HTML template.
   * The paginator object is used to emit an event when the user changes the page size or page. 
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Observes the sort in the HTML template.
   * The sort object is used to emit an event when the user changes the sort direction or the sorted column.
   */
  @ViewChild(MatSort) sort: MatSort;

  private _data: ArmonikData<T, O>[];
  private _columns: TableColumn<T, O>[];
  private _columnsKeys: ColumnKey<T, O>[];
  private _isAllSelected: boolean = false;

  get data(): ArmonikData<T, O>[] {
    return this._data;
  }

  get columns(): TableColumn<T, O>[] {
    return this._columns;
  }

  get columnsKeys(): ColumnKey<T, O>[] {
    return this._columnsKeys;
  }

  get isAllSelected(): boolean {
    return this._isAllSelected;
  }

  selection = new SelectionModel<T>(true, []);

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.options.pageIndex = 0; // If the user change the sort order, reset back to the first page.
      this.options.sort = {
        active: this.sort.active as keyof DataRaw,
        direction: this.sort.direction
      };
      this.optionsChange.emit();
    });

    this.paginator.page.subscribe(() => {
      if (this.options.pageSize > this.paginator.pageSize) this.data = this.data.slice(0, this.paginator.pageSize);
      this.options.pageIndex = this.paginator.pageIndex;
      this.options.pageSize = this.paginator.pageSize;
      this.optionsChange.emit();
    });
  }

  ngOnDestroy(): void {
    this.sort.sortChange.unsubscribe();
    this.paginator.page.unsubscribe();
  }

  /**
   * Emits the new columns positions to the parent component.
   * @param event CdkDragDrop - contains information about the
   */
  onDrop(event: CdkDragDrop<string[]>) {
    const columns = this._columns;
    moveItemInArray(columns, event.previousIndex, event.currentIndex);
    this.columns = columns;
    this.columnDrop.emit(this.columns.map(column => column.key));
  }

  /**
   * Emits when the selection change.
   */
  emitSelectionChange(): void {
    this.selectionChange.emit(this.selection.selected);
  }

  /**
   * Checks if a row is selected. Uses the provided dataComparator method (return false otherwise).
   * @param row row to check
   * @returns true if the row is selected, false if it is not
   */
  isSelected(row: T): boolean {
    return this.selection.selected.some(selectedRow => {
      if (this.dataComparator) {
        return this.dataComparator(row, selectedRow);
      } else {
        return false;
      }
    });
  }

  /**
   * Select or unselect all rows.
   */
  toggleAllRows(): void {
    if (this.isAllSelected) {
      this.selection.clear();
      this._isAllSelected = false;
    } else {
      this.selection.select(...(this.data.map(d => d.raw)));
      this._isAllSelected = true;
    }
    this.emitSelectionChange();
  }

  /**
   * Select the row associated to the provided data
   * @param row row to select
   */
  toggleRow(row: T): void {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.select(row);
    }
    this.emitSelectionChange();
  }

  /**
   * Emits when displayed statuses in personalizeTaskByStatus changes.
   */
  onPersonalizeTasksByStatus(): void {
    this.personalizeTasksByStatus.emit();
  }
}