import { FilterStringOperator, ResultRawEnumField, TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard} from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Scope } from '@app/types/config';
import { TaskData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableColumn } from '@components/table/column.type';
import { ActionTable, TableActionsComponent } from '@components/table/table-actions.component';
import { TableColumnComponent } from '@components/table/table-column.type';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { AbstractTableComponent } from '@components/table/table.abstract.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { TasksStatusesService } from '../services/tasks-statuses.service';
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryFilters } from '../types';

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
    TasksByStatusService,
    Clipboard,
  ],
  imports: [
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatPaginatorModule,
    TableEmptyDataComponent,
    MatMenuModule,
    MatSortModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatIconModule,
    DragDropModule,
    MatButtonModule,
    MatCheckboxModule,
    TableActionsComponent,
    TableColumnComponent,
  ]
})
export class TasksTableComponent extends AbstractTableComponent<TaskSummaryColumnKey, TaskSummary, TaskSummaryFilters, TaskData>{
  tableScope: Scope = 'tasks';
  @Input() serviceIcon: string | null = null;
  @Input() serviceName: string | null = null;
  @Input() urlTemplate: string | null = null;

  @Input({required: true}) set inputData(entries: TaskSummary[]) {
    this._data = [];
    entries.forEach(entry => {
      const lineData: TaskData = {
        raw: entry,
        resultsQueryParams: this.createResultsQueryParams(entry.id),
      };
      this._data.push(lineData);
    });
  }

  @Output() retries = new EventEmitter<TaskSummary>();
  @Output() cancelTask = new EventEmitter<string>();

  readonly _tasksStatusesService = inject(TasksStatusesService);
  readonly #filtersService = inject(FiltersService);
  readonly #notificationService = inject(NotificationService);
  #copyService = inject(Clipboard);
  #router = inject(Router);

  get data(): TaskData[] {
    return this._data;
  }

  copy$ = new Subject<TaskData>();
  copyS = this.copy$.subscribe((data) => this.onCopiedTaskId(data as TaskData));

  seeResult$ = new Subject<TaskData>();
  resultSubscription = this.seeResult$.subscribe((data) => this.#router.navigate(['/results'], { queryParams: data.resultsQueryParams }));

  retries$ = new Subject<TaskData>();
  retriesSubscription = this.retries$.subscribe((data) => this.onRetries(data.raw));

  cancelTask$ = new Subject<TaskData>();
  cancelTaskSubscription = this.cancelTask$.subscribe((data) => this.onCancelTask(data.raw.id));

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
  ];

  isRetried(task: TaskSummary): boolean {
    return this._tasksStatusesService.isRetried(task.status);
  }

  canCancelTask(task: TaskSummary): boolean {
    return !this._tasksStatusesService.notEnded(task.status);
  }

  statusToLabel(status: TaskStatus): string {
    return this._tasksStatusesService.statusToLabel(status);
  }

  createResultsQueryParams(taskId: string) {
    if (this.filters.length === 0) {
      const keyTask = this.#filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);

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
        return this.#filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);
      } else if (filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID) {
        return this.#filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
      }
    }
    return null;
  }

  onCopiedTaskId(data: TaskData) {
    this.#copyService.copy(data.raw.id);
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
      this.selection.select(...(this.data.map(task => task.raw.id)));
  }

  checkboxLabel(): string {
    return $localize`${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }

  trackByColumn(index: number, item: TableColumn<TaskSummaryColumnKey>): string {
    return item.key;
  }
}