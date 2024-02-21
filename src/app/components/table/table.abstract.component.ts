import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TaskSummaryFilters } from '@app/tasks/types';
import { Scope } from '@app/types/config';
import { ArmonikData, DataRaw, IndexListOptions, RawColumnKey, RawListFilters } from '@app/types/data';
import { TaskStatusColored, ViewTasksByStatusDialogData, } from '@app/types/dialog';
import { ListSortOptions } from '@app/types/options';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { IconsService } from '@services/icons.service';
import { TableService } from '@services/table.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { TableColumn } from './column.type';

@Component({
  selector: 'app-partitions-table',
  standalone: true,
  template: '',
})
export abstract class AbstractTableComponent<K extends RawColumnKey, D extends DataRaw, F extends RawListFilters> implements OnInit, AfterViewInit {
  abstract tableScope: Scope;
  @Input({ required: true }) displayedColumns: TableColumn<K>[] = [];

  @Input({ required: true }) options: IndexListOptions;
  @Input({ required: true }) total: number;
  @Input({ required: true }) filters: F;
  @Input() lockColumns = false;

  abstract _data: ArmonikData<D>[];
  abstract get data(): ArmonikData<D>[];

  abstract set inputData(entries: D[]);

  @Output() optionsChange = new EventEmitter<never>();

  tasksStatusesColored: TaskStatusColored[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly tableService = inject(TableService);
  readonly tasksByStatusService = inject(TasksByStatusService);
  readonly dialog = inject(MatDialog);
  readonly iconsService = inject(IconsService);

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  ngOnInit() {
    this.restoreStatus();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.options.pageIndex = 0; // If the user change the sort order, reset back to the first page.
      this.options.sort = {
        active: this.sort.active,
        direction: this.sort.direction
      } as unknown as ListSortOptions<object>;
      this.optionsChange.emit();
    });

    this.paginator.page.subscribe(() => {
      this.options.pageIndex = this.paginator.pageIndex;
      this.options.pageSize = this.paginator.pageSize;
      this.optionsChange.emit();
    });
  }

  isTableWithCount(): boolean {
    return this.tableScope === 'applications' || this.tableScope === 'sessions' || this.tableScope === 'partitions';
  }

  restoreStatus() {
    if (this.isTableWithCount()) {
      this.tasksStatusesColored = this.tasksByStatusService.restoreStatuses(this.tableScope as TableTasksByStatus);
    }
  }

  saveStatus(statuses: TaskStatusColored[]) {
    if (this.isTableWithCount()) {
      this.tasksByStatusService.saveStatuses(this.tableScope as TableTasksByStatus, statuses);
    }
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  abstract countTasksByStatusFilters(...id: string[]): TaskSummaryFilters;

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    this.tableService.saveColumns(`${this.tableScope}-columns`, this.displayedColumns.map(col => col.key));
  }

  personalizeTasksByStatus() {
    const dialogRef = this.dialog.open<ViewTasksByStatusDialogComponent, ViewTasksByStatusDialogData>(ViewTasksByStatusDialogComponent, {
      data: {
        statusesCounts: this.tasksStatusesColored,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.tasksStatusesColored = result;
      this.saveStatus(result);
    });
  }
}