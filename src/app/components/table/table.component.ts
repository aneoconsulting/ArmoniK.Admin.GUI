import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TableColumn } from '@app/types/column.type';
import { ArmonikData, ArmonikDataType, DataRaw, IndexListOptions, RawColumnKey, Status } from '@app/types/data';
import { TaskStatusColored } from '@app/types/dialog';
import { StatusesServiceI } from '@app/types/services';
import { ActionTable } from '@app/types/table';
import { TableContainerComponent } from '@components/table-container.component';
import { TableActionsComponent } from './table-actions.component';
import { TableCellComponent } from './table-cell.component';
import { TableColumnHeaderComponent } from './table-column-header.component';
import { TableEmptyDataComponent } from './table-empty-data.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [
    TableColumnHeaderComponent,
    TableCellComponent,
    MatPaginatorModule,
    TableEmptyDataComponent,
    DragDropModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatSortModule,
    TableActionsComponent,
    TableContainerComponent,
  ]
})
export class TableComponent<K extends RawColumnKey, R extends DataRaw, D extends ArmonikDataType, S extends Status> implements AfterViewInit, OnDestroy {
  // Required inputs
  @Input({ required: true }) set columns(entries: TableColumn<K>[]) {
    this._columns = entries;
    this._columnsKeys = entries.map((entry) => entry.key);
  }

  @Input({ required: true }) set data(entries: ArmonikData<R>[]) {
    const selectedRows = this.selection.selected;
    this._data = entries;
    this.selection.select(...selectedRows.filter(row => entries.find(entry => entry.raw === row)));
  }

  @Input({ required: true }) total: number;

  @Input({ required: true }) options: IndexListOptions;
  @Input({ required: true }) lockColumns: boolean;

  // Optional inputs
  @Input({ required: false }) actions: ActionTable<D>[];
  @Input({ required: false }) statusesService: StatusesServiceI<S>;
  @Input({ required: false }) tasksStatusesColored: TaskStatusColored[] = [];

  @Output() columnDrop = new EventEmitter<K[]>();
  @Output() optionsChange = new EventEmitter<never>();
  @Output() selectionChange = new EventEmitter<R[]>();
  @Output() personnalizeTasksByStatus = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private _data: ArmonikData<R>[];
  private _columns: TableColumn<K>[];
  private _columnsKeys: K[];

  get data(): ArmonikData<R>[] {
    return this._data;
  }

  get columns(): TableColumn<K>[] {
    return this._columns;
  }

  get columnsKeys(): K[] {
    return this._columnsKeys;
  }

  selection = new SelectionModel<R>(true, []);

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

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selection.select(...(this.data.map(d => d.raw)));
    this.emitSelectionChange();
  }

  toggleRow(data: R): void {
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