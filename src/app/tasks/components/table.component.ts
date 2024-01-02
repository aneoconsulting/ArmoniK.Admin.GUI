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
  template: `
<app-table-container>
  <table mat-table matSort [matSortActive]="options.sort.active" recycleRows matSortDisableClear [matSortDirection]="options.sort.direction" [dataSource]="data" cdkDropList cdkDropListOrientation="horizontal" [cdkDropListDisabled]="lockColumns" (cdkDropListDropped)="onDrop($event)">

    <ng-container *ngFor="let column of displayedColumns; trackBy:trackByColumn" [matColumnDef]="column">
      <!-- Header -->
      <ng-container *ngIf="!isSelectColumn(column)">
        <th mat-header-cell mat-sort-header [disabled]="isNotSortableColumn(column)" *matHeaderCellDef cdkDrag appNoWrap>
          {{ columnToLabel(column) }}
        </th>
      </ng-container>
      <!-- Header for selection -->
      <ng-container *ngIf="isSelectColumn(column)">
        <th mat-header-cell *matHeaderCellDef cdkDrag appNoWrap>
          <mat-checkbox (change)="$event ? toggleAllRows() : null"
                        [checked]="selection.hasValue() && isAllSelected()"
                        [indeterminate]="selection.hasValue() && !isAllSelected()"
                        [aria-label]="checkboxLabel()">
          </mat-checkbox>
        </th>
      </ng-container>

      <!-- Selection -->
      <ng-container *ngIf="isSelectColumn(column)">
       <td mat-cell *matCellDef="let element" appNoWrap>
           <mat-checkbox (click)="$event.stopPropagation()"
              (change)="$event ? selection.toggle(element) : null"
              [checked]="selection.isSelected(element)"
              [aria-label]="checkboxLabel(element)">
            </mat-checkbox>
        </td>
      </ng-container>
      <!-- Columns -->
      <ng-container *ngIf="isSimpleColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <span> {{ show(element, column) | emptyCell }} </span>
        </td>
      </ng-container>
      <!-- ID -->
      <ng-container *ngIf="isTaskIdColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <a mat-button
            [routerLink]="['/tasks/', element[column]]"
          >
            {{ element[column] }}
          </a>
        </td>
      </ng-container>
      <!-- Status -->
      <ng-container *ngIf="isStatusColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <span> {{ statusToLabel(element[column]) }} </span>
        </td>
      </ng-container>
      <!-- Date -->
      <ng-container *ngIf="isDateColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <ng-container *ngIf="element[column]; else noDate">
            {{ columnToDate(element[column]) | date: 'yyyy-MM-dd &nbsp;HH:mm:ss.SSS' }}
          </ng-container>
        </td>
      </ng-container>
      <!-- Duration -->
      <ng-container *ngIf="isDurationColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <!-- TODO: move this function to a service in order to reuse extraction logic -->
          {{ extractData(element, column) | duration | emptyCell }}
        </td>
      </ng-container>
      <!-- Object -->
      <ng-container *ngIf="isObjectColumn(column)">
       <td mat-cell *matCellDef="let element" appNoWrap>
          <app-table-inspect-object [object]="handleNestedKeys(column, element)" [label]="columnToLabel(column)"></app-table-inspect-object>
        </td>
      </ng-container>
      <!-- Actions -->
      <ng-container *ngIf="isActionsColumn(column)">
        <!-- TODO: use icons service -->
        <td mat-cell *matCellDef="let element" appNoWrap>
        <button mat-icon-button [matMenuTriggerFor]="menu" (menuOpened)="this.stopInterval.next()" (menuClosed)="this.interval.next(this.intervalValue)" aria-label="Show more" i18n-aria-label>

            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item [cdkCopyToClipboard]="element.id" (cdkCopyToClipboardCopied)="onCopiedTaskId()">
              <mat-icon aria-hidden="true" fontIcon="content_copy"></mat-icon>
              <span i18n>Copy Task ID</span>
            </button>
            <a mat-menu-item [routerLink]="['/results']" [queryParams]="createTaskIdQueryParams(element.id)">
              <mat-icon aria-hidden="true" fontIcon="visibility"></mat-icon>
              <span i18n> See related result </span>
            </a>
            <button *ngIf="isRetried(element)" mat-menu-item (click)="onRetries(element)">
              <mat-icon aria-hidden="true" fontIcon="published_with_changes"></mat-icon>
              <span i18n> See Retries </span>
            </button>
            <button mat-menu-item (click)="onCancelTask(element.id)">
              <mat-icon aria-hidden="true" fontIcon="cancel"></mat-icon>
              <span i18n> Cancel task </span>
            </button>
            <a mat-menu-item *ngIf="urlTemplate && serviceName && serviceIcon" [href]="generateViewInLogsUrl(element.id)" target="_blank">
              <mat-icon aria-hidden="true" [fontIcon]="serviceIcon"></mat-icon>
              <span i18n> View in {{ serviceName }} </span>
            </a>
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

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of tasks" i18n-aria-label>
    </mat-paginator>
</app-table-container>

<ng-template #noDate>
  <span> - </span>
</ng-template>
  `,
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

  show(session: TaskSummary, column: TaskSummaryColumnKey) {
    if (column.startsWith('options.')) {
      const optionColumn = column.replace('options.', '') as keyof TaskOptions;
      const options = session['options'] as TaskOptions | undefined;

      if (!options) {
        return null;
      }

      return options[optionColumn];
    }

    return session[column as keyof TaskSummary];
  }

  extractData(element: TaskSummary, column: TaskSummaryColumnKey): Duration | null {
    if (column.startsWith('options.')) {
      const optionColumn = column.replace('options.', '') as keyof TaskOptions;
      const options = element['options'] as TaskOptions | undefined;

      if (!options) {
        return null;
      }

      return options[optionColumn] as unknown as Duration;
    }

    return element[column as keyof TaskSummary] as unknown as Duration;
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
      return $localize`${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }

    if (this.selection.isSelected(row)) {
      return $localize`Deselect Task ${row.id}`;
    }

    return $localize`Select Task ${row.id}`;
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
}