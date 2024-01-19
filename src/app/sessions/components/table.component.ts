import { FilterStringOperator, SessionRaw, SessionRawEnumField, SessionStatus, TaskOptionEnumField, TaskOptions, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { Task } from '@app/partitions/components/table.component';
import { TaskSummaryFiltersOr } from '@app/tasks/types';
import { TaskStatusColored, ViewTasksByStatusDialogData } from '@app/types/dialog';
import { Filter } from '@app/types/filters';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { SessionsIndexService } from '../services/sessions-index.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRawColumnKey, SessionRawFieldKey, SessionRawFiltersOr, SessionRawListOptions } from '../types';

@Component({
  selector: 'app-sessions-table',
  standalone: true,
  template: `
<app-table-container>
  <table mat-table matSort [matSortActive]="options.sort.active" matSortDisableClear recycleRows [matSortDirection]="options.sort.direction" [dataSource]="data" cdkDropList cdkDropListOrientation="horizontal" [cdkDropListDisabled]="lockColumns" (cdkDropListDropped)="onDrop($event)">

    <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
      <!-- Header -->
      <th mat-header-cell mat-sort-header [disabled]="isNotSortableColumn(column)" *matHeaderCellDef cdkDrag appNoWrap>
        {{ columnToLabel(column) }}
        <button mat-icon-button *ngIf="isCountColumn(column)" (click)="personalizeTasksByStatus()" i18n-matTooltip matTooltip="Personalize Tasks Status">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('tune')"></mat-icon>
        </button>
      </th>
      <!-- Columns -->
      <ng-container *ngIf="isSimpleColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <span> {{ show(element.raw, column) | emptyCell }} </span>
        </td>
      </ng-container>
      <!-- ID -->
      <ng-container *ngIf="isSessionIdColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <a mat-button
            [routerLink]="['/sessions', element.raw.sessionId]"
          >
            {{ element.raw[column] }}
          </a>
        </td>
      </ng-container>
      <!-- Object -->
      <ng-container *ngIf="isObjectColumn(column)">
       <td mat-cell *matCellDef="let element" appNoWrap>
          <app-table-inspect-object [object]="element.raw[column]" [label]="columnToLabel(column)"></app-table-inspect-object>
        </td>
      </ng-container>
      <!-- Date -->
      <ng-container *ngIf="isDateColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <ng-container *ngIf="element.raw[column]; else noDate">
            {{ columnToDate(element.raw[column]) | date: 'yyyy-MM-dd &nbsp;HH:mm:ss.SSS' }}
          </ng-container>
        </td>
      </ng-container>
      <!-- Duration -->
      <ng-container *ngIf="isDurationColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <!-- TODO: move this function to a service in order to reuse extraction logic -->
          {{ extractData(element.raw, column) | duration | emptyCell }}
        </td>
      </ng-container>
      <!-- Status -->
      <ng-container *ngIf="isStatusColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <span> {{ statusToLabel(element.raw[column]) }} </span>
        </td>
      </ng-container>
      <!-- Session's Tasks Count by Status -->
      <ng-container *ngIf="isCountColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <app-count-tasks-by-status
            [statuses]="tasksStatusesColored"
            [queryParams]="element.queryParams"
            [filters]="element.filters"
          >
          </app-count-tasks-by-status>
        </td>
      </ng-container>
      <!-- Generics -->
      <ng-container *ngIf="isGenericColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          {{handleGenericColumn(column, element.raw)}}
        </td>
      </ng-container>
      <!-- Actions -->
      <ng-container *ngIf="isActionsColumn(column)">
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Actions">
            <mat-icon [fontIcon]="getIcon('more')"></mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item [cdkCopyToClipboard]="element.raw.sessionId" (cdkCopyToClipboardCopied)="onCopiedSessionId()">
              <mat-icon aria-hidden="true" [fontIcon]="getIcon('copy')"></mat-icon>
              <span i18n>Copy Session ID</span>
            </button>
            <a mat-menu-item [routerLink]="['/tasks']" [queryParams]="createSessionIdQueryParams(element.raw.sessionId)">
              <mat-icon aria-hidden="true" fontIcon="adjust"></mat-icon>
              <span i18n>See related tasks</span>
            </a>
            <a mat-menu-item [routerLink]="['/results']" [queryParams]="{ sessionId: element.raw.sessionId }">
              <mat-icon aria-hidden="true" fontIcon="workspace_premium"></mat-icon>
              <span i18n>See results</span>
            </a>
            <button mat-menu-item (click)="onCancel(element.raw.sessionId)">
              <mat-icon aria-hidden="true" [fontIcon]="getIcon('cancel')"></mat-icon>
              <span i18n>Cancel session</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>
    </ng-container>

    <!-- Empty -->
    <tr *matNoDataRow>
      <td [attr.colspan]="displayedColumns.length">
        <app-table-empty-data></app-table-empty-data>
      </td>
    </tr>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of sessions" i18n-aria-label>
    </mat-paginator>
</app-table-container>

<ng-template #noDate>
  <span> - </span>
</ng-template>
  `,
  styles: [
    
  ],
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
export class ApplicationsTableComponent implements OnInit, AfterViewInit {

  @Input({required: true}) displayedColumns: SessionRawColumnKey[] = [];
  @Input({required: true}) options: SessionRawListOptions;
  @Input({required: true}) total: number;
  @Input({required: true}) filters: SessionRawFiltersOr;
  @Input() lockColumns = false;

  private _data: Task[] = [];
  get data(): Task[] {
    return this._data;
  }

  @Input({ required: true }) set data(entries: SessionRaw.AsObject[]) {
    this._data = [];
    entries.forEach(entry => {
      const task: Task = {
        raw: entry,
        queryParams: this.createTasksByStatusQueryParams(entry.sessionId),
        filters: this.countTasksByStatusFilters(entry.sessionId)
      };
      this._data.push(task);
    });
  }

  @Output() optionsChange = new EventEmitter<never>();
  @Output() cancelSession = new EventEmitter<string>();

  tasksStatusesColored: TaskStatusColored[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  readonly _sessionsIndexService = inject(SessionsIndexService);
  readonly _tasksByStatusService = inject(TasksByStatusService);
  readonly _iconsService = inject(IconsService);
  readonly _filtersService = inject(FiltersService);
  readonly _notificationService = inject(NotificationService);
  readonly _sessionsStatusesService = inject(SessionsStatusesService);
  readonly _dialog = inject(MatDialog);

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
      this.options.pageIndex = this.paginator.pageIndex;
      this.options.pageSize = this.paginator.pageSize;
      this.optionsChange.emit();
    });
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  columnToLabel(column: SessionRawColumnKey): string {
    return this._sessionsIndexService.columnToLabel(column);
  }

  isGenericColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isGenericColumn(column);
  }

  isNotSortableColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isNotSortableColumn(column);
  }

  isSimpleColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isSimpleColumn(column);
  }

  isSessionIdColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isSessionIdColumn(column);
  }

  isObjectColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isObjectColumn(column);
  }

  isDateColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isDateColumn(column);
  }

  isDurationColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isDurationColumn(column);
  }

  isStatusColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isStatusColumn(column);
  }

  isCountColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isCountColumn(column);
  }

  isActionsColumn(column: SessionRawColumnKey): boolean {
    return this._sessionsIndexService.isActionsColumn(column);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._sessionsIndexService.saveColumns(this.displayedColumns);
  }

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
            const filterLabel = this.#createQueryParamFilterKey(filter, index);
            if (filterLabel && filter.value) params[filterLabel] = filter.value.toString();
          }
        });
        params[`${index}-root-${TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = sessionId;
      });
      return params;
    }
  }

  #createQueryParamFilterKey(filter: Filter<SessionRawEnumField, TaskOptionEnumField>, orGroup: number): string | null {
    if (filter.field !== null && filter.operator !== null) {
      if (filter.for === 'root' && filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID) {
        return this._filtersService.createQueryParamsKey<TaskSummaryEnumField>(orGroup, 'root', filter.operator, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
      } else if (filter.for === 'options') {
        return this._filtersService.createQueryParamsKey<TaskOptionEnumField>(orGroup, 'options', filter.operator, filter.field as TaskOptionEnumField);
      }
    }
    return null;
  }

  countTasksByStatusFilters(sessionId: string): TaskSummaryFiltersOr {
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

  handleGenericColumn(column: SessionRawColumnKey, element: SessionRaw) {
    const field = this._sessionsIndexService.genericField(column);
    return element.options?.options[field];
  }
}