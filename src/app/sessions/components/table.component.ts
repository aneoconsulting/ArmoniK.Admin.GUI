import { FilterStringOperator, ResultRawEnumField, SessionRawEnumField, SessionStatus, TaskOptionEnumField, TaskOptions, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { TaskSummaryFilters } from '@app/tasks/types';
import { Scope } from '@app/types/config';
import { SessionData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { AbstractTableTaskByStatusComponent } from '@components/table/table.abstract.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { SessionsIndexService } from '../services/sessions-index.service';
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
    ClipboardModule,
    DatePipe,
    DurationPipe,
    EmptyCellPipe,
    TableInspectObjectComponent,
    MatDialogModule
  ]
})
export class ApplicationsTableComponent extends AbstractTableTaskByStatusComponent<SessionRawColumnKey, SessionRaw, SessionRawFilters> {
  override tableScope: Scope = 'sessions';
  _data: SessionData[] = [];
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
  readonly _sessionsStatusesService = inject(SessionsStatusesService);
  readonly _filtersService = inject(FiltersService);
  readonly _sessionsIndexService = inject(SessionsIndexService);
  readonly _notificationService = inject(NotificationService);

  extractData(element: SessionRaw, column: SessionRawColumnKey): Duration | null {
    return this.show(element, column) as Duration | null;
  }

  // TODO: move to a service for date and time
  columnToDate(element: Timestamp | undefined): Date | null {
    if (!element) {
      return null;
    }

    return element.toDate();
  }

  statusToLabel(status: SessionStatus): string {
    return this._sessionsStatusesService.statusToLabel(status);
  }

  onCopiedSessionId() {
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

  show(session: SessionRaw, column: SessionRawColumnKey) {
    if (column.startsWith('options.')) {
      const optionColumn = column.replace('options.', '') as keyof TaskOptions;
      const options = session['options'] as TaskOptions | undefined;

      if (!options) {
        return null;
      }

      return options[optionColumn];
    }

    return session[column as keyof SessionRaw];
  }

  handleGenericColumn(column: SessionRawColumnKey, element: SessionData) {
    const field = column.replace('options.options.', '');
    return element.raw.options?.options[field];
  }

  handleNestedKeys(nestedKeys: string, element: {[key: string]: object}) {
    const keys = nestedKeys.split('.');
    let resultObject: {[key: string]: object} = element;
    keys.forEach(key => {
      resultObject = resultObject[key] as unknown as {[key: string]: object};
    });
    return resultObject;
  }
}