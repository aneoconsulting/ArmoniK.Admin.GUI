import { FilterStringOperator, ResultRawEnumField, SessionRawEnumField, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard} from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Params, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { TaskSummaryFilters } from '@app/tasks/types';
import { AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import {  ColumnKey, SessionData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { Page } from '@app/types/pages';
import { ActionTable } from '@app/types/table';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableActionsComponent } from '@components/table/table-actions.component';
import { TableCellComponent } from '@components/table/table-cell.component';
import { TableColumnHeaderComponent } from '@components/table/table-column-header.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
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
    DragDropModule,
    MatButtonModule,
    DatePipe,
    TableInspectObjectComponent,
    MatDialogModule,
    TableCellComponent,
    TableActionsComponent,
    NgIf,
    TableColumnHeaderComponent,
  ]
})
export class ApplicationsTableComponent extends AbstractTaskByStatusTableComponent<SessionRaw, SessionRawColumnKey, SessionRawListOptions>  implements OnInit {
  @Input({required: true}) filters: SessionRawFilters;
  @Output() pauseSession = new EventEmitter<string>();
  @Output() resumeSession = new EventEmitter<string>();
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

  pauseSession$ = new Subject<SessionData>();
  pauseSessionSubscription = this.pauseSession$.subscribe(data => this.onPause(data.raw.sessionId));

  resumeSession$ = new Subject<SessionData>();
  resumeSessionSubscription = this.resumeSession$.subscribe(data => this.onResume(data.raw.sessionId));

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
      label: 'Pause session',
      icon: this.getIcon('pause'),
      action$: this.pauseSession$,
      condition: (element: SessionData) => this.statusesService.canPause(element.raw.status)
    },
    {
      label: 'Resume session',
      icon: this.getIcon('play'),
      action$: this.resumeSession$,
      condition: (element: SessionData) => this.statusesService.canResume(element.raw.status)
    },
    {
      label: 'Cancel session',
      icon: this.getIcon('cancel'),
      action$: this.cancelSession$,
      condition: (element: SessionData) => this.statusesService.canCancel(element.raw.status)
    },
    {
      label: 'Close session',
      icon: this.getIcon('close'),
      action$: this.closeSession$,
      condition: (element: SessionData) => this.statusesService.canClose(element.raw.status)
    },
    {
      label: 'Delete session',
      icon: this.getIcon('delete'),
      action$: this.deleteSession$,
      condition: (element: SessionData) => this.statusesService.canDelete(element.raw.status)
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

  onPause(sessionId: string) {
    this.pauseSession.emit(sessionId);
  }

  onResume(sessionId: string) {
    this.resumeSession.emit(sessionId);
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
