import { FilterStringOperator, ResultRawEnumField, TaskOptions, TaskStatus, TaskSummary } from '@aneoconsultingfr/armonik.api.angular';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { Duration , Timestamp} from '@ngx-grpc/well-known-types';
import { Subject } from 'rxjs';
import { TaskStatusColored } from '@app/types/dialog';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksIndexService } from '../services/tasks-index.service';
import { TasksStatusesService } from '../services/tasks-statuses.service';
import { TaskSummaryColumnKey, TaskSummaryFieldKey, TaskSummaryListOptions } from '../types';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  templateUrl: './table.component.html', 
  styles: [

  ],
  providers: [
    MatDialog,
    IconsService,
    FiltersService,
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
    DatePipe,
    RouterLink,
    DurationPipe,
    TableInspectObjectComponent,
    ClipboardModule,
    MatCheckboxModule
  ]
})
export class TasksTableComponent implements AfterViewInit {

  @Input({required: true}) displayedColumns: TaskSummaryColumnKey[] = [];
  @Input({required: true}) options: TaskSummaryListOptions;
  @Input({required: true}) data: TaskSummary.AsObject[] = [];
  @Input({required: true}) total: number;
  @Input({required: true}) stopInterval: Subject<void>;
  @Input({required: true}) interval: Subject<number>;
  @Input({required: true}) intervalValue: number;
  @Input({required: true}) selection: SelectionModel<TaskSummary.AsObject>;
  @Input() serviceIcon: string | null = null;
  @Input() serviceName: string | null = null;
  @Input() urlTemplate: string | null = null;
  @Input() lockColumns = false;

  @Output() optionsChange = new EventEmitter<never>();
  @Output() retries = new EventEmitter<TaskSummary>();
  @Output() cancelTask = new EventEmitter<string>();

  tasksStatusesColored: TaskStatusColored[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly #tasksIndexService = inject(TasksIndexService );
  readonly #tasksStatusesService = inject(TasksStatusesService);
  readonly #filtersService = inject(FiltersService);
  readonly #notificationService = inject(NotificationService);

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.options.pageIndex = 0; // If the user change the sort order, reset back to the first page.
      this.options.sort = {
        active: this.sort.active as TaskSummaryFieldKey,
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

  show(task: TaskSummary, column: TaskSummaryColumnKey) {
    if (column.startsWith('options.')) {
      const optionColumn = column.replace('options.', '') as keyof TaskOptions;
      const options = task['options'] as TaskOptions | undefined;

      if (!options) {
        return null;
      }

      return options[optionColumn];
    }

    return task[column as keyof TaskSummary];
  }

  extractData(task: TaskSummary, column: TaskSummaryColumnKey): Duration | null {
    return (this.show(task, column) as Duration) ?? null;
  }

  isGenericColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isGenericColumn(column);
  }

  isActionsColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isActionsColumn(column);
  }

  isTaskIdColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isTaskIdColumn(column);
  }

  isStatusColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isStatusColumn(column);
  }

  isDateColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isDateColumn(column);
  }

  isDurationColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isDurationColumn(column);
  }

  isObjectColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isObjectColumn(column);
  }

  isSelectColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isSelectColumn(column);
  }

  isSimpleColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isSimpleColumn(column);
  }

  isNotSortableColumn(column: TaskSummaryColumnKey): boolean {
    return this.#tasksIndexService.isNotSortableColumn(column);
  }

  isRetried(task: TaskSummary): boolean {
    return this.#tasksStatusesService.isRetried(task.status);
  }

  columnToDate(element: Timestamp | undefined): Date | null {
    if (!element) {
      return null;
    }

    return element.toDate();
  }

  statusToLabel(status: TaskStatus): string {
    return this.#tasksStatusesService.statusToLabel(status);
  }

  columnToLabel(column: TaskSummaryColumnKey): string {
    return this.#tasksIndexService.columnToLabel(column);
  }

  createTaskIdQueryParams(taskId: string) {
    const keyTask = this.#filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);

    return {
      [keyTask]: taskId
    };
  }

  onCopiedTaskId() {
    this.#notificationService.success('Task ID copied to clipboard');
  }

  onRetries(task: TaskSummary) {
    this.retries.emit(task);
  }

  onCancelTask(id: string) {
    this.cancelTask.emit(id);
  }

  generateViewInLogsUrl(taskId: string): string {
    if (!this.urlTemplate) {
      return '';
    }

    return this.urlTemplate.replaceAll('%taskId', taskId);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selection.select(...(this.data as TaskSummary[]));
  }

  checkboxLabel(row?: TaskSummary): string {
    if (!row) {
      return $localize`${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    else if (this.selection.isSelected(row)) {
      return $localize`Deselect Task ${row.id}`;
    }
    else {
      return $localize`Select Task ${row.id}`;
    }
  }

  trackByColumn(index: number, item: TaskSummaryColumnKey): string {
    return item;
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this.#tasksIndexService.saveColumns(this.displayedColumns);
  }

  handleNestedKeys(nestedKeys: string, element: {[key: string]: object}) {
    const keys = nestedKeys.split('.');
    let resultObject: {[key: string]: object} = element;
    keys.forEach(key => {
      resultObject = resultObject[key] as unknown as {[key: string]: object};
    });
    return resultObject;
  }

  handleGenericColumn(column: TaskSummaryColumnKey, element: TaskSummary) {
    const field = this.#tasksIndexService.genericField(column);
    return element.options?.options[field];
  }
}