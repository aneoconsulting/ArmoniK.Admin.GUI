import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ArmonikData, ColumnKey, DataRaw } from '@app/types/data';
import { ListOptions } from '@app/types/options';
import { Status, StatusService } from '@app/types/status';
import { ActionTable } from '@app/types/table';
import { TableContainerComponent } from '@components/table-container.component';
import { TableActionsComponent } from './table-actions.component';
import { TableCellComponent } from './table-cell.component';
import { TableColumnHeaderComponent } from './table-column-header.component';
import { TableEmptyDataComponent } from './table-empty-data.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  imports: [
    TableColumnHeaderComponent,
    TableCellComponent,
    MatPaginatorModule,
    TableEmptyDataComponent,
    DragDropModule,
    MatTableModule,
    MatSortModule,
    TableActionsComponent,
    TableContainerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null> implements AfterViewInit, OnDestroy {
  // Required inputs
  @Input({ required: true }) set columns(entries: TableColumn<T, O>[]) {
    this._columns = entries;
    this._columnsKeys = entries.map((entry) => entry.key);
  }

  @Input({ required: true }) set data(entries: ArmonikData<T, O>[]) {
    this._data = entries;
    if (this.dataComparator) {
      const selection = entries.filter(entry => this.isSelected(entry.raw)).map(entry => entry.raw);
      this.selection.clear();
      this.selection.select(...selection);
      this._isAllSelected = this.selection.selected.length === entries.length;
    }
  }

  @Input({ required: true }) total: number;

  @Input({ required: true }) options: ListOptions<T, O>;
  @Input({ required: true }) lockColumns: boolean;

  // Optional inputs
  @Input({ required: false }) actions: ActionTable<T, O>[];
  @Input({ required: false }) statusesService: StatusService<S>;
  @Input({ required: false }) statusesGroups: TasksStatusesGroup[];
  @Input({ required: false }) dataComparator: ((a: T, b: T) => boolean) | undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Input({ required: false }) trackBy(index: number, item: ArmonikData<T, O>): number | string {
    return index;
  }

  @Output() columnDrop = new EventEmitter<ColumnKey<T, O>[]>();
  @Output() optionsChange = new EventEmitter<never>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() personnalizeTasksByStatus = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
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

  onDrop(event: CdkDragDrop<string[]>) {
    const columns = this._columns;
    moveItemInArray(columns, event.previousIndex, event.currentIndex);
    this.columns = columns;
    this.columnDrop.emit(this.columns.map(column => column.key));
  }

  emitSelectionChange(): void {
    this.selectionChange.emit(this.selection.selected);
  }

  isSelected(row: T): boolean {
    return this.selection.selected.find(selectedRow => {
      if (this.dataComparator) {
        return this.dataComparator(row, selectedRow);
      } else {
        return false;
      }
    }) !== undefined;
  }

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

  toggleRow(data: T): void {
    if (this.selection.isSelected(data)) {
      this.selection.deselect(data);
    } else {
      this.selection.select(data);
    }
    this.emitSelectionChange();
  }

  onPersonnalizeTasksByStatus(): void {
    this.personnalizeTasksByStatus.emit();
  }
}