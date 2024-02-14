import { FilterStringOperator, PartitionRaw, PartitionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TaskSummaryFiltersOr } from '@app/tasks/types';
import { PartitionData } from '@app/types/data';
import { TaskStatusColored, ViewTasksByStatusDialogData, } from '@app/types/dialog';
import { Filter } from '@app/types/filters';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { PartitionsIndexService } from '../services/partitions-index.service';
import { PartitionRawColumnKey, PartitionRawFieldKey, PartitionRawFiltersOr, PartitionRawListOptions } from '../types';

@Component({
  selector: 'app-partitions-table',
  standalone: true,
  templateUrl: './table.component.html',
  styles: [

  ],
  providers: [
    TasksByStatusService,
    IconsService,
    FiltersService
  ],
  imports: [
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatPaginatorModule,
    TableEmptyDataComponent,
    MatMenuModule,
    CountTasksByStatusComponent,
    MatSortModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatIconModule,
    RouterModule,
    EmptyCellPipe,
    DragDropModule,
    MatButtonModule,
    TableInspectObjectComponent,
    MatDialogModule
  ]
})
export class PartitionsTableComponent implements OnInit, AfterViewInit {

  @Input({ required: true }) displayedColumns: PartitionRawColumnKey[] = [];
  @Input({ required: true }) options: PartitionRawListOptions;
  @Input({ required: true }) total: number;
  @Input({ required: true }) filters: PartitionRawFiltersOr;
  @Input() lockColumns = false;

  private _data: PartitionData[] = [];
  get data(): PartitionData[] {
    return this._data;
  }

  @Input({ required: true }) set data(entries: PartitionRaw.AsObject[]) {
    this._data = [];
    entries.forEach(entry => {
      const task: PartitionData = {
        raw: entry,
        queryTasksParams: this.createTasksByStatusQueryParams(entry.id),
        filters: this.countTasksByStatusFilters(entry.id)
      };
      this._data.push(task);
    });
  }

  @Output() optionsChange = new EventEmitter<never>();

  tasksStatusesColored: TaskStatusColored[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly #partitionsIndexService = inject(PartitionsIndexService);
  readonly #tasksByStatusService = inject(TasksByStatusService);
  readonly #filtersService = inject(FiltersService);
  readonly #dialog = inject(MatDialog);
  readonly #iconsService = inject(IconsService);

  ngOnInit() {
    this.tasksStatusesColored = this.#tasksByStatusService.restoreStatuses('partitions');
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.options.pageIndex = 0; // If the user change the sort order, reset back to the first page.
      this.options.sort = {
        active: this.sort.active as PartitionRawFieldKey,
        direction: this.sort.direction
      };
      this.optionsChange.emit();
    });

    this.paginator.page.subscribe(() => {
      this.options.pageIndex = this.paginator.pageIndex;
      this.options.pageSize = this.paginator.pageSize;
      this.optionsChange.emit();
    });
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  columnToLabel(column: PartitionRawColumnKey): string {
    return this.#partitionsIndexService.columnToLabel(column);
  }

  isPartitionIdColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isPartitionIdColumn(column);
  }

  isObjectColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isObjectColumn(column);
  }

  isCountColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isCountColumn(column);
  }

  isNotSortableColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isNotSortableColumn(column);
  }

  isSimpleColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isSimpleColumn(column);
  }

  createTasksByStatusQueryParams(partition: string) {
    if (this.filters.length === 0) {
      return {
        [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: partition,
      };
    }
    const params: Record<string, string> = {};
    this.filters.forEach((filtersAnd, index) => {
      filtersAnd.filter(filter => this.#isTaskFilter(filter)).forEach((filter) => {
        const taskField = this.#partitionToTaskFilter(filter.field as PartitionRawEnumField | null);
        if (taskField && filter.operator !== null && filter.value !== null) {
          const key = this.#filtersService.createQueryParamsKey(index, 'options', filter.operator, taskField);
          params[key] = filter.value?.toString();
        }
      });
      params[`${index}-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = partition;
    });
    return params;
  }

  #isTaskFilter(filter: Filter<PartitionRawEnumField, null>): boolean {
    return filter.field === PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID || filter.field === PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY;
  }

  #partitionToTaskFilter(field: PartitionRawEnumField | null) {
    switch (field) {
    case PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID;
    case PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PRIORITY;
    default:
      return null;
    }
  }

  countTasksByStatusFilters(partitionId: string): TaskSummaryFiltersOr {
    return [
      [
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
          value: partitionId,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        }
      ]
    ];
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this.#partitionsIndexService.saveColumns(this.displayedColumns);
  }

  personalizeTasksByStatus() {
    const dialogRef = this.#dialog.open<ViewTasksByStatusDialogComponent, ViewTasksByStatusDialogData>(ViewTasksByStatusDialogComponent, {
      data: {
        statusesCounts: this.tasksStatusesColored,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.tasksStatusesColored = result;
      this.#tasksByStatusService.saveStatuses('partitions', result);
    });
  }
}