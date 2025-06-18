import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output, Signal, ViewContainerRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageGroupsDialogData, ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { ManageGroupsDialogComponent } from '@components/statuses/manage-groups-dialog.component';
import { ManageGroupsTableDialogInput, ManageGroupsTableDialogResult, ManageTableGroupsDialogComponent } from '@components/table/group/manage-groups-dialog/manage-groups-dialog.component';
import { NotificationService } from '@services/notification.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { TableColumn } from '../column.type';
import { ArmonikData, ColumnKey, DataRaw } from '../data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '../filters';
import { ListOptions } from '../options';
import { DataFilterService } from '../services/data-filter.service';
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
    this.columns = columns;
    this.columnKeys = columns.map(column => column.key);
  }
  @Input() lockColumns = false;
  @Output() columnUpdate = new EventEmitter<ColumnKey<T, O>[]>();
  @Output() optionsUpdate = new EventEmitter<void>();

  columns: TableColumn<T, O>[] = [];
  columnKeys: ColumnKey<T, O>[];

  data: Signal<ArmonikData<T, O>[]>;

  total: Signal<number>;

  options: ListOptions<T, O>;

  filters: FiltersOr<F, FO>;
  
  readonly notificationService = inject(NotificationService);
  abstract readonly tableDataService: AbstractTableDataService<T, F, O, FO>;
  readonly dialog = inject(MatDialog);
  private readonly viewContainerRef = inject(ViewContainerRef);
  abstract readonly filtersService: DataFilterService<F, FO>;

  protected initTableDataService() {
    this.data = this.tableDataService.data;
    this.total = this.tableDataService.total;
    this.options = this.tableDataService.options;
    this.filters = this.tableDataService.filters;
  }

  onDrop(columnsKeys: ColumnKey<T, O>[]) {
    this.columnUpdate.emit(columnsKeys);
  }

  onOptionsChange() {
    this.optionsUpdate.emit();
  }

  updateGroupPage(groupName: string) {
    this.tableDataService.refreshGroup(groupName);
  }

  openGroupSettings(groupName: string) {
    const dialogRef = this.dialog.open<ManageTableGroupsDialogComponent<F, FO>, ManageGroupsTableDialogInput<F, FO>, ManageGroupsTableDialogResult<F, FO>>(ManageTableGroupsDialogComponent, {
      data: {
        groups: this.tableDataService.groupsConditions,
        selected: groupName,
      },
      viewContainerRef: this.viewContainerRef
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tableDataService.manageGroupDialogResult(result);
        this.filtersService.saveGroups(this.tableDataService.groupsConditions);
      }
    });
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