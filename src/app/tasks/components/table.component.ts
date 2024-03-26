import { FilterStringOperator, ResultRawEnumField, TaskOptionEnumField, TaskSummaryEnumField} from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard , ClipboardModule } from '@angular/cdk/clipboard';
import { SelectionModel } from '@angular/cdk/collections';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink , RouterModule} from '@angular/router';
import { Subject } from 'rxjs';
import { AbstractTableComponent, SelectableTable } from '@app/types/components/table';
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
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryFilters, TaskSummaryListOptions } from '../types';

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
export class TasksTableComponent extends AbstractTableComponent<TaskSummary, TaskSummaryColumnKey, TaskSummaryListOptions> implements SelectableTable<TaskSummary>, OnInit {
  @Input({required: true}) stopInterval: Subject<void>;
  @Input({required: true}) interval: Subject<number>;
  @Input({required: true}) intervalValue: number;
  @Input({required: true}) selection: SelectionModel<string>;
  @Input() filters: TaskSummaryFilters = [];
  @Input({required: true}) serviceIcon$: Subject<string | null>;
  @Input() serviceIcon: string | null = null;
  @Input() serviceName: string | null = null;
  @Input() urlTemplate: string | null = null;

  @Output() retries = new EventEmitter<TaskSummary>();
  @Output() cancelTask = new EventEmitter<string>();

  tasksStatusesColored: TaskStatusColored[] = [];

  override readonly indexService = inject(TasksIndexService);
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
      icon: 'copy',
      action$: this.copy$,
    },
    {
      label: $localize`See related result`,
      icon: 'view',
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
  ];

  ngOnInit(): void {
    this.serviceIcon$.subscribe(icon => {
      if (icon) {
        const index = this.actions.findIndex(action => action.label === $localize`View in logs`);
        if (index !== -1) {
          this.actions[index].icon = icon;
        } else {
          this.actions.push({
            label: $localize`View in logs`,
            icon,
            action$: this.openViewInLogs$,
          });
        }
      }
    });
  }

  isDataRawEqual(value: TaskSummary, entry: TaskSummary): boolean {
    return value.id === entry.id;
  }

  createNewLine(entry: TaskSummary): TaskData {
    return {
      raw: entry,
      resultsQueryParams: this.createResultsQueryParams(entry.id),
      value$: new Subject<TaskSummary>()
    };
  }

  createResultsQueryParams(taskId: string) {
    if (this.filters.length === 0) {
      const keyTask = this.filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);

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
        return this.filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);
      } else if (filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID) {
        return this.filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
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
}