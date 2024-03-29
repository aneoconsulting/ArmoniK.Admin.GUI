import { FilterStringOperator, ResultRawEnumField, SessionRawEnumField, SessionStatus, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard} from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Params, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { TaskSummaryFilters } from '@app/tasks/types';
import { AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import {  ColumnKey, SessionData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { Page } from '@app/types/pages';
import { ActionTable } from '@app/types/table';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { SessionsIndexService } from '../services/sessions-index.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRaw, SessionRawColumnKey, SessionRawFilters, SessionRawListOptions } from '../types';

@Component({
  selector: 'app-sessions-table',
  standalone: true,
  templateUrl: './table.component.html',
  styles: [
    
  ],
  providers: [
    TasksByStatusService,
    MatDialog,
    IconsService,
    FiltersService,
    Clipboard,
  ],
  imports: [
    TableComponent,
    RouterModule,
    MatDialogModule,
  ]
})
export class ApplicationsTableComponent extends AbstractTaskByStatusTableComponent<SessionRaw, SessionRawColumnKey, SessionRawListOptions>  implements OnInit {
  @Input({required: true}) filters: SessionRawFilters;
  @Output() cancelSession = new EventEmitter<string>();
  @Output() closeSession = new EventEmitter<string>();
  @Output() deleteSession = new EventEmitter<string>();
  
  override readonly indexService = inject(SessionsIndexService);
  readonly iconsService = inject(IconsService);
  readonly notificationService = inject(NotificationService);
  readonly statusesService = inject(SessionsStatusesService);
  readonly router = inject(Router);
  readonly copyService = inject(Clipboard);

  table: TableTasksByStatus = 'sessions';

  copy$ = new Subject<SessionData>();
  copySubscription = this.copy$.subscribe(data => this.onCopiedSessionId(data));

  seeSessions$ = new Subject<SessionData>();
  seeSessionsSubscription = this.seeSessions$.subscribe(data => this.router.navigate(['/sessions', data.raw.sessionId]));

  seeResults$ = new Subject<SessionData>();
  seeResultsSubscription = this.seeResults$.subscribe(data => this.router.navigate(['/results'], { queryParams: data.resultsQueryParams }));

  cancelSession$ = new Subject<SessionData>();
  cancelSessionSubscription = this.cancelSession$.subscribe(data => this.onCancel(data.raw.sessionId));

  closeSession$ = new Subject<SessionData>();
  closeSessionSubscription = this.closeSession$.subscribe(data => this.onClose(data.raw.sessionId));

  deleteSession$ = new Subject<SessionData>();
  deleteSessionSubscription = this.deleteSession$.subscribe(data => this.onDelete(data.raw.sessionId));

  actions: ActionTable<SessionData>[] = [
    {
      label: 'Copy session ID',
      icon: this.getIcon('copy'),
      action$: this.copy$, 
    },
    {
      label: 'See session',
      icon: this.getPageIcon('sessions'),
      action$: this.seeSessions$,
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
    },
    {
      label: 'Close session',
      icon: this.getIcon('close'),
      action$: this.closeSession$,
      condition: (element: SessionData) => element.raw.status === SessionStatus.SESSION_STATUS_RUNNING
    },
    {
      label: 'Delete session',
      icon: this.getIcon('delete'),
      action$: this.deleteSession$,
    }
  ];

  isDataRawEqual(value: SessionRaw, entry: SessionRaw): boolean {
    return value.sessionId === entry.sessionId;
  }

  createNewLine(entry: SessionRaw): SessionData {
    const queryParams = new Map<ColumnKey<SessionRaw>, Params>();
    queryParams.set('sessionId', { '0-root-1-0': entry.sessionId }); 
    return {
      raw: entry,
      queryParams,
      resultsQueryParams: this.createResultsQueryParams(entry.sessionId),
      queryTasksParams: this.createTasksByStatusQueryParams(entry.sessionId),
      filters: this.countTasksByStatusFilters(entry.sessionId),
      value$: new Subject<SessionRaw>()
    };
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  getPageIcon(page: Page): string {
    return this.iconsService.getPageIcon(page);
  }

  onCopiedSessionId(data: SessionData) {
    this.copyService.copy(data.raw.sessionId);
    this.notificationService.success('Session ID copied to clipboard');
  }

  createSessionIdQueryParams(sessionId: string) {
    const keySession = this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
  }

  createTasksByStatusQueryParams(sessionId: string) {
    if(this.filters.length === 0) {
      const keySession = this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);

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
        return this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(orGroup, 'root', filter.operator, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
      } else if (filter.for === 'options') {
        return this.filtersService.createQueryParamsKey<TaskOptionEnumField>(orGroup, 'options', filter.operator, filter.field as TaskOptionEnumField);
      }
    }
    return null;
  }

  createResultsQueryParams(sessionId: string) {
    if(this.filters.length === 0) {
      const keySession = this.filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);

      return {
        [keySession]: sessionId
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        filterAnd.forEach(filter => {
          if (filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID && filter.operator !== FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL && filter.value !== null && filter.operator !== null) {
            const filterLabel = this.filtersService.createQueryParamsKey<ResultRawEnumField>(index, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
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

  onClose(sessionId: string) {
    this.closeSession.emit(sessionId);
  }

  onDelete(sessionId: string) {
    this._data = this.data.filter(session => session.raw.sessionId !== sessionId);
    this.deleteSession.emit(sessionId);
  }
}