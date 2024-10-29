import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageGroupsDialogData, ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { ManageGroupsDialogComponent } from '@components/statuses/manage-groups-dialog.component';
import { NotificationService } from '@services/notification.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { TableColumn } from '../column.type';
import { ArmonikData, ColumnKey, DataRaw } from '../data';
import { FiltersEnums, FiltersOptionsEnums } from '../filters';
import { AbstractTableDataService } from '../services/table-data.service';

export interface SelectableTable<D extends DataRaw> {
  selection: SelectionModel<string>;
  isAllSelected(): boolean;
  toggleAllRows(): void;
  checkboxLabel(row?: ArmonikData<D>): string;
}

@Component({
  selector: 'app-abstract-table',
  template: '',
})
export abstract class AbstractTableComponent<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> {
  @Input({ required: true }) set displayedColumns(columns: TableColumn<T, O>[]) {
    this._displayedColumns = columns;
    this._columnKeys = columns.map(column => column.key);
  }
  @Input() lockColumns = false;
  @Output() columnUpdate = new EventEmitter<ColumnKey<T, O>[]>();
  @Output() optionsUpdate = new EventEmitter<void>();

  private _displayedColumns: TableColumn<T, O>[] = [];
  private _columnKeys: ColumnKey<T, O>[];

  get data() {
    return this.tableDataService.data;
  }

  get total() {
    return this.tableDataService.total;
  }

  get options() {
    return this.tableDataService.options;
  }

  get filters() {
    return this.tableDataService.filters;
  }

  get columnKeys() {
    return this._columnKeys;
  }

  get displayedColumns() {
    return this._displayedColumns;
  }
  
  readonly notificationService = inject(NotificationService);
  abstract readonly tableDataService: AbstractTableDataService<T, F, O, FO>;

  onDrop(columnsKeys: ColumnKey<T, O>[]) {
    this.columnUpdate.emit(columnsKeys);
  }

  onOptionsChange() {
    this.optionsUpdate.emit();
  }

  abstract isDataRawEqual(value: T, entry: T): boolean;
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
}