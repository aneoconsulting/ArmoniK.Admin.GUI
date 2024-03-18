import { FilterStringOperator, ResultRawEnumField, SessionRawEnumField, SessionStatus, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard} from '@angular/cdk/clipboard';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { TaskSummaryFilters } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { SessionData } from '@app/types/data';
import { TaskStatusColored, ViewTasksByStatusDialogData } from '@app/types/dialog';
import { Filter } from '@app/types/filters';
import { Page } from '@app/types/pages';
import { ActionTable } from '@app/types/table';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableActionsComponent } from '@components/table/table-actions.component';
import { TableCellComponent } from '@components/table/table-cell.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { SessionsIndexService } from '../services/sessions-index.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRaw, SessionRawColumnKey, SessionRawFieldKey, SessionRawFilters, SessionRawListOptions } from '../types';

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
  ]
})
export class ApplicationsTableComponent implements OnInit, AfterViewInit {

  @Input({required: true}) displayedColumns: TableColumn<SessionRawColumnKey>[] = [];
  @Input({required: true}) options: SessionRawListOptions;
  @Input({required: true}) total: number;
  @Input({required: true}) filters: SessionRawFilters;
  @Input({ required: true}) data$: Subject<SessionRaw[]>;
  @Input() lockColumns = false;

  private _data: SessionData[] = [];
  get data(): SessionData[] {
    return this._data;
  }

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  @Output() optionsChange = new EventEmitter<never>();
  @Output() cancelSession = new EventEmitter<string>();
  @Output() closeSession = new EventEmitter<string>();

  tasksStatusesColored: TaskStatusColored[] = [];
  dataSource = new MatTableDataSource<SessionData>(this._data);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  readonly _sessionsIndexService = inject(SessionsIndexService);
  readonly _tasksByStatusService = inject(TasksByStatusService);
  readonly _iconsService = inject(IconsService);
  readonly _filtersService = inject(FiltersService);
  readonly _notificationService = inject(NotificationService);
  readonly _sessionsStatusesService = inject(SessionsStatusesService);
  readonly _dialog = inject(MatDialog);
  readonly _router = inject(Router);
  readonly _copyService = inject(Clipboard);

  copy$ = new Subject<SessionData>();
  copySubscription = this.copy$.subscribe(data => this.onCopiedSessionId(data));

  seeTasks$ = new Subject<SessionData>();
  seeTasksSubscription = this.seeTasks$.subscribe(data => this._router.navigate(['/tasks'], { queryParams: data.queryTasksParams }));

  seeResults$ = new Subject<SessionData>();
  seeResultsSubscription = this.seeResults$.subscribe(data => this._router.navigate(['/results'], { queryParams: data.resultsQueryParams }));

  cancelSession$ = new Subject<SessionData>();
  cancelSessionSubscription = this.cancelSession$.subscribe(data => this.onCancel(data.raw.sessionId));

  closeSession$ = new Subject<SessionData>();
  closeSessionSubscription = this.closeSession$.subscribe(data => this.onClose(data.raw.sessionId));

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
    },
    {
      label: 'Close session',
      icon: this.getIcon('close'),
      action$: this.closeSession$,
      condition: (element: SessionData) => element.raw.status === SessionStatus.SESSION_STATUS_RUNNING
    }
  ];

  ngOnInit(): void {
    this.tasksStatusesColored = this._tasksByStatusService.restoreStatuses('sessions');
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.options.pageIndex = 0; // If the user change the sort order, reset back to the first page.
      this.options.sort = {
        active: this.sort.active as SessionRawFieldKey,
        direction: this.sort.direction
      };
      this.optionsChange.emit();
    });

    this.paginator.page.subscribe(() => {
      if (this.options.pageSize > this.paginator.pageSize) this._data = [];
      this.options.pageIndex = this.paginator.pageIndex;
      this.options.pageSize = this.paginator.pageSize;
      this.optionsChange.emit();
    });

    this.data$.subscribe(entries => {
      entries.forEach((entry, index) => {
        const session = this._data[index];
        if (session && session.raw.sessionId === entry.sessionId) {
          if (this.hasDifference(session.raw, entry)) {
            session.raw = entry;
            this._data.splice(index, 1, session);
            this._data[index].value$.next(entry);
          }
        } else {
          const session: SessionData = {
            raw: entry,
            queryTasksParams: this.createTasksByStatusQueryParams(entry.sessionId),
            resultsQueryParams: {...this.createResultsQueryParams(entry.sessionId)},
            filters: this.countTasksByStatusFilters(entry.sessionId),
            value$: new Subject<SessionRaw>(),
          };
          this._data.splice(index, 1, session);
        }
      });
      this.dataSource.data = this._data;
    });
  }

  hasDifference(first: SessionRaw, second: SessionRaw): boolean{
    const keys = Object.keys(first);
    for(const key of keys) {
      if (JSON.stringify(first[key as keyof SessionRaw]) !== JSON.stringify(second[key as keyof SessionRaw])) {
        return true;
      }
    }
    return false;
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  getPageIcon(page: Page): string {
    return this._iconsService.getPageIcon(page);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._sessionsIndexService.saveColumns(this.displayedColumns.map(column => column.key));
  }

  onCopiedSessionId(data: SessionData) {
    this._copyService.copy(data.raw.sessionId);
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

  onClose(sessionId: string) {
    this.closeSession.emit(sessionId);
  }

  personalizeTasksByStatus() {
    const dialogRef = this._dialog.open<ViewTasksByStatusDialogComponent, ViewTasksByStatusDialogData>(ViewTasksByStatusDialogComponent, {
      data: {
        statusesCounts: this.tasksStatusesColored,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksStatusesColored = result;
        this._tasksByStatusService.saveStatuses('sessions', result);
      }
    });
  }
}