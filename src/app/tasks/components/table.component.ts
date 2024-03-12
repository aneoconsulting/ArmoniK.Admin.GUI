import { FilterStringOperator, ResultRawEnumField, TaskOptionEnumField, TaskSummaryEnumField} from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard , ClipboardModule } from '@angular/cdk/clipboard';
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
import { Router, RouterLink , RouterModule} from '@angular/router';
import { Subject } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { TaskData } from '@app/types/data';
import { TaskStatusColored } from '@app/types/dialog';
import { Filter } from '@app/types/filters';
import { ActionTable } from '@app/types/table';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableActionsComponent } from '@components/table/table-actions.component';
import { TableCellComponent } from '@components/table/table-cell.component';
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
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryFieldKey, TaskSummaryFilters, TaskSummaryListOptions } from '../types';

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
    Clipboard,
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
    MatCheckboxModule,
    TableCellComponent,
    MatCheckboxModule,
    TableActionsComponent,
  ]
})
export class TasksTableComponent implements AfterViewInit {

  @Input({required: true}) displayedColumns: TableColumn<TaskSummaryColumnKey>[] = [];
  @Input({required: true}) options: TaskSummaryListOptions;
  @Input({required: true}) total: number;
  @Input({required: true}) stopInterval: Subject<void>;
  @Input({required: true}) interval: Subject<number>;
  @Input({required: true}) intervalValue: number;
  @Input({required: true}) selection: SelectionModel<string>;
  @Input() filters: TaskSummaryFilters = [];
  @Input() serviceIcon: string | null = null;
  @Input() serviceName: string | null = null;
  @Input() urlTemplate: string | null = null;
  @Input() lockColumns = false;

  private _data: TaskData[] = [];
  get data(): TaskData[] {
    return this._data;
  }

  @Input({required: true}) set data(entries: TaskSummary[]) {
    this._data = [];
    entries.forEach(entry => {
      const lineData: TaskData = {
        raw: entry,
        resultsQueryParams: this.createResultsQueryParams(entry.id),
      };
      this._data.push(lineData);
    });
  }

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  @Output() optionsChange = new EventEmitter<never>();
  @Output() retries = new EventEmitter<TaskSummary>();
  @Output() cancelTask = new EventEmitter<string>();

  tasksStatusesColored: TaskStatusColored[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly _tasksIndexService = inject(TasksIndexService );
  readonly _filtersService = inject(FiltersService);
  readonly #notificationService = inject(NotificationService);
  readonly _router = inject(Router);
  readonly _clipboard = inject(Clipboard);
  readonly _tasksStatusesService = inject(TasksStatusesService);

  copy$ = new Subject<TaskData>();
  copyS = this.copy$.subscribe((data) => this.onCopiedTaskId(data as TaskData));

  seeResult$ = new Subject<TaskData>();
  resultSubscription = this.seeResult$.subscribe((data) => this._router.navigate(['/results'], { queryParams: data.resultsQueryParams }));

  retries$ = new Subject<TaskData>();
  retriesSubscription = this.retries$.subscribe((data) => this.onRetries(data.raw));

  cancelTask$ = new Subject<TaskData>();
  cancelTaskSubscription = this.cancelTask$.subscribe((data) => this.onCancelTask(data.raw.id));

  openViewInLogs$ = new Subject<TaskData>();
  openViewInLogsSubscription = this.openViewInLogs$.subscribe((data) => window.open(this.generateViewInLogsUrl(data.raw.id), '_blank'));

  actions: ActionTable<TaskData>[] = [
    {
      label: $localize`Copy Task ID`,
      icon: 'content_copy',
      action$: this.copy$,
    },
    {
      label: $localize`See related result`,
      icon: 'visibility',
      action$: this.seeResult$,
    },
    {
      label: $localize`Retries`,
      icon: 'published_with_changes',
      action$: this.retries$,
      condition: (element: TaskData) => this.isRetried(element.raw),
    },
    {
      label: $localize`Cancel task`,
      icon: 'cancel',
      action$: this.cancelTask$,
      condition: (element: TaskData) => this.canCancelTask(element.raw),
    },
    {
      label: $localize`View in logs`,
      icon: this.serviceIcon ?? 'description',
      action$: this.openViewInLogs$,
      condition: () => !!(this.urlTemplate && this.serviceName && this.serviceName),
    }
  ];

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

  createResultsQueryParams(taskId: string) {
    if (this.filters.length === 0) {
      const keyTask = this._filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);

      return {
        [keyTask]: taskId
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        filterAnd.forEach(filter => {
          if (!(filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID && filter.operator === FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL)) {
            const filterLabel = this.#createResultFilterLabel(filter, index);
            if (filterLabel && filter.value) params[filterLabel] = filter.value.toString();
          }
        });
        params[`${index}-root-${ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = taskId;
      });
      return params;
    }
  }

  #createResultFilterLabel(filter: Filter<TaskSummaryEnumField, TaskOptionEnumField>, orGroup: number) {
    if (filter.field !== null && filter.operator !== null) {
      if (filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID) {
        return this._filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);
      } else if (filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID) {
        return this._filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
      }
    }
    return null;
  }

  onCopiedTaskId(element: TaskData) {
    this._clipboard.copy(element.raw.id);
    this.#notificationService.success('Task ID copied to clipboard');
  }

  isRetried(task: TaskSummary): boolean {
    return this._tasksStatusesService.isRetried(task.status);
  }

  canCancelTask(task: TaskSummary): boolean {
    return !this._tasksStatusesService.taskNotEnded(task.status);
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
      this.selection.select(...(this.data.map(task => task.raw.id)));
  }

  checkboxLabel(row?: TaskData): string {
    if (!row) {
      return $localize`${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    else if (this.selection.isSelected(row.raw.id)) {
      return $localize`Deselect Task ${row.raw.id}`;
    }
    else {
      return $localize`Select Task ${row.raw.id}`;
    }
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._tasksIndexService.saveColumns(this.displayedColumns.map(column => column.key));
  }
}