import { FilterStringOperator, ResultRawEnumField, SessionRawEnumField, SessionStatus, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard} from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TaskSummaryFilters } from '@app/tasks/types';
import { Scope } from '@app/types/config';
import { SessionData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { ActionTable, TableActionsComponent } from '@components/table/table-actions.component';
import { TableColumnComponent } from '@components/table/table-column.type';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { AbstractTableTaskByStatusComponent } from '@components/table/table.abstract.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRaw, SessionRawColumnKey, SessionRawFilters } from '../types';

@Component({
  selector: 'app-sessions-table',
  standalone: true,
  templateUrl: './table.component.html',
  styles: [],
  providers: [
    TasksByStatusService,
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
    MatSortModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatIconModule,
    DragDropModule,
    MatButtonModule,
    MatDialogModule,
    TableActionsComponent,
    TableColumnComponent,
  ]
})
export class ApplicationsTableComponent extends AbstractTableTaskByStatusComponent<SessionRawColumnKey, SessionRaw, SessionRawFilters, SessionData> {
  tableScope: Scope = 'sessions';

  readonly _sessionsStatusesService = inject(SessionsStatusesService);
  readonly _filtersService = inject(FiltersService);
  readonly _notificationService = inject(NotificationService);
  readonly _copyService = inject(Clipboard);
  readonly _router = inject(Router);

  get data(): SessionData[] {
    return this._data;
  }

  @Input({ required: true }) set inputData(entries: SessionRaw[]) {
    this._data = [];
    entries.forEach(entry => {
      const task: SessionData = {
        raw: entry,
        queryTasksParams: this.createTasksByStatusQueryParams(entry.sessionId),
        resultsQueryParams: {...this.createResultsQueryParams(entry.sessionId)},
        filters: this.countTasksByStatusFilters(entry.sessionId)
      };
      this._data.push(task);
    });
  }

  @Output() cancelSession = new EventEmitter<string>();

  copy$ = new Subject<SessionData>();
  copySubscription = this.copy$.subscribe(data => this.onCopiedSessionId(data));

  seeTasks$ = new Subject<SessionData>();
  seeTasksSubscription = this.seeTasks$.subscribe(data => this._router.navigate(['/tasks'], { queryParams: data.queryTasksParams }));

  seeResults$ = new Subject<SessionData>();
  seeResultsSubscription = this.seeResults$.subscribe(data => this._router.navigate(['/results'], { queryParams: data.resultsQueryParams }));

  cancelSession$ = new Subject<SessionData>();
  cancelSessionSubscription = this.cancelSession$.subscribe(data => this.onCancel(data.raw.sessionId));

  actions: ActionTable<SessionData>[] = [
    {
      label: 'Copy session ID',
      icon: this.getIcon('copy'),
      action$: this.copy$, 
    },
    {
      label: 'See tasks',
      icon: this.getPageIcon('tasks'),
      action$: this.seeTasks$,
    },
    {
      label: 'See results',
      icon: this.getPageIcon('results'),
      action$: this.seeResults$,
    },
    {
      label: 'Cancel session',
      icon: this.getIcon('cancel'),
      action$: this.cancelSession$, 
      condition: (element: SessionData) => element.raw.status === SessionStatus.SESSION_STATUS_RUNNING
    }
  ];

  onCopiedSessionId(data: SessionData) {
    this.copy$.next(data);
    this._notificationService.success('Session ID copied to clipboard');
  }

  createSessionIdQueryParams(sessionId: string) {
    const keySession = this._filtersService.createQueryParamsKey<TaskSummaryEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
  }

  createTasksByStatusQueryParams(sessionId: string) {
    if(this.filters.length === 0) {
      const keySession = this._filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);

      return {
        [keySession]: sessionId,
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        filterAnd.forEach(filter => {
          if (!(filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID && filter.operator === FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL)) {
            const filterLabel = this.#createTaskByStatusLabel(filter, index);
            if (filterLabel && filter.value) params[filterLabel] = filter.value.toString();
          }
        });
        params[`${index}-root-${TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = sessionId;
      });
      return params;
    }
  }

  #createTaskByStatusLabel(filter: Filter<SessionRawEnumField, TaskOptionEnumField>, orGroup: number): string | null {
    if (filter.field !== null && filter.operator !== null) {
      if (filter.for === 'root' && filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID) {
        return this._filtersService.createQueryParamsKey<TaskSummaryEnumField>(orGroup, 'root', filter.operator, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
      } else if (filter.for === 'options') {
        return this._filtersService.createQueryParamsKey<TaskOptionEnumField>(orGroup, 'options', filter.operator, filter.field as TaskOptionEnumField);
      }
    }
    return null;
  }

  createResultsQueryParams(sessionId: string) {
    if(this.filters.length === 0) {
      const keySession = this._filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);

      return {
        [keySession]: sessionId
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        filterAnd.forEach(filter => {
          if (filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID && filter.operator !== FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL && filter.value !== null && filter.operator !== null) {
            const filterLabel = this._filtersService.createQueryParamsKey<ResultRawEnumField>(index, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
            if (filterLabel) params[filterLabel] = filter.value.toString();
          }
        });
        params[`${index}-root-${TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = sessionId;
      });
      return params;
    }
  }

  countTasksByStatusFilters(sessionId: string): TaskSummaryFilters {
    return [
      [
        {
          for: 'root',
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
          value: sessionId,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        }
      ]
    ];
  }

  onCancel(sessionId: string) {
    this.cancelSession.emit(sessionId);
  }
}