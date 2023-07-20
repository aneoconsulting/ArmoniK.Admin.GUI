import { TaskOptions, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { TasksGrpcService } from './services/tasks-grpc.service';
import { TasksIndexService } from './services/tasks-index.service';
import { TasksStatusesService } from './services/tasks-status.service';
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryFieldKey, TaskSummaryFilter, TaskSummaryFilterField, TaskSummaryListOptions} from './types';

@Component({
  selector: 'app-tasks-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('tasks')"></mat-icon>
  <span i18n="Page title"> Tasks </span>
</app-page-header>

<mat-toolbar>
  <mat-toolbar-row>
    <app-table-actions-toolbar
      [loading]="isLoading"
      [refreshTooltip]="autoRefreshTooltip()"
      [intervalValue]="intervalValue"
      [columnsLabels]="columnsLabels()"
      [displayedColumns]="displayedColumns"
      [availableColumns]="availableColumns"
      (refresh)="onRefresh()"
      (intervalValueChange)="onIntervalValueChange($event)"
      (displayedColumnsChange)="onColumnsChange($event)"
      (resetColumns)="onColumnsReset()"
      (resetFilters)="onFiltersReset()">
        <ng-container extra-buttons-right>
          <button mat-flat-button color="accent" (click)="onCancelTasksSelection()" [disabled]="!selection.selected.length">
            <mat-icon matListIcon aria-hidden="true" fontIcon="stop"></mat-icon>
            <span i18n> Cancel Tasks </span>
          </button>
        </ng-container>
    </app-table-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row>
    <app-filters-toolbar [filters]="filters" [filtersFields]="availableFiltersFields" [columnsLabels]="columnsLabels()" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<app-table-container>
  <table mat-table matSort [matSortActive]="options.sort.active" matSortDisableClear [matSortDirection]="options.sort.direction" [dataSource]="data" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="onDrop($event)">

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
            [routerLink]="['/results']"
            [queryParams]="{
              ownerTaskId: element[column],
            }"
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
          <app-table-inspect-object [object]="element[column]" [label]="columnToLabel(column)"></app-table-inspect-object>
        </td>
      </ng-container>
      <!-- Actions -->
      <ng-container *ngIf="isActionsColumn(column)">
        <!-- TODO: use icons service -->
        <td mat-cell *matCellDef="let element" appNoWrap>
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Show more" i18n-aria-label>
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item [cdkCopyToClipboard]="element.id" (cdkCopyToClipboardCopied)="onCopiedTaskId()">
              <mat-icon aria-hidden="true" fontIcon="content_copy"></mat-icon>
              <span i18n>Copy Task ID</span>
            </button>
            <a mat-menu-item [routerLink]="['/tasks', element.id]">
              <mat-icon aria-hidden="true" fontIcon="visibility"></mat-icon>
              <span i18n> See task </span>
            </a>
            <button *ngIf="isRetried(element)" mat-menu-item (click)="onRetries(element)">
              <mat-icon aria-hidden="true" fontIcon="published_with_changes"></mat-icon>
              <span i18n> See Retries </span>
            </button>
            <button mat-menu-item (click)="onCancelTask(element.id)">
              <mat-icon aria-hidden="true" fontIcon="cancel"></mat-icon>
              <span i18n> Cancel task </span>
            </button>
            </mat-menu>
          </td>
      </ng-container>
    </ng-container>

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
  styles: [`
app-table-actions-toolbar {
  flex-grow: 1;
}
  `],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterModule,
    EmptyCellPipe,
    DurationPipe,
    DatePipe,
    NoWrapDirective,
    FiltersToolbarComponent,
    TableActionsToolbarComponent,
    TableContainerComponent,
    TableInspectObjectComponent,
    PageHeaderComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    DragDropModule,
    ClipboardModule,
  ],
  providers: [
    TasksGrpcService,
    TasksStatusesService,
    TasksIndexService,
    TableService,
    TableStorageService,
    TableURLService,
    NotificationService,
    AutoRefreshService,
    ShareUrlService,
    QueryParamsService,
    UtilsService,
  ],
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  #iconsService = inject(IconsService);
  #shareURLService = inject(ShareUrlService);
  #autoRefreshService = inject(AutoRefreshService);
  #tasksStatusesService = inject(TasksStatusesService);
  #tasksIndexService = inject(TasksIndexService);
  #tasksGrpcService = inject(TasksGrpcService);
  #notificationService = inject(NotificationService);

  displayedColumns: TaskSummaryColumnKey[] = [];
  availableColumns: TaskSummaryColumnKey[] = [];

  selection = new SelectionModel<TaskSummary>(true, []);

  isLoading = true;
  data: TaskSummary[] = [];
  total = 0;

  options: TaskSummaryListOptions;

  filters: TaskSummaryFilter[] = [];
  availableFiltersFields: TaskSummaryFilterField[] = [];

  sharableURL = '';

  intervalValue = 0;
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.displayedColumns = this.#tasksIndexService.restoreColumns();
    this.availableColumns = this.#tasksIndexService.availableColumns;

    this.options = this.#tasksIndexService.restoreOptions();

    this.availableFiltersFields = this.#tasksIndexService.availableFiltersFields;
    this.filters = this.#tasksIndexService.restoreFilters();

    this.intervalValue = this.#tasksIndexService.restoreIntervalValue();

    this.sharableURL = this.#shareURLService.generateSharableURL(this.options, this.filters);
  }

  ngAfterViewInit(): void {
    // If the user change the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    const mergeSubscription = merge(this.sort.sortChange, this.paginator.page, this.refresh, this.interval$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;

          const options: TaskSummaryListOptions = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sort: {
              active: this.sort.active as TaskSummaryFieldKey,
              direction: this.sort.direction,
            }
          };
          const filters = this.filters;

          this.sharableURL = this.#shareURLService.generateSharableURL(options, filters);
          this.#tasksIndexService.saveOptions(options);

          return this.#tasksGrpcService.list$(options, filters).pipe(
            catchError((error) => {
              console.error(error);
              this.#notificationService.error('Unable to fetch tasks');
              return of(null);
            }),
          );
        }),
        map(data => {
          this.isLoading = false;

          this.total = data?.total ?? 0;

          const tasks = data?.tasks ?? [];
          return tasks;
        }),
      )
      .subscribe((data) => {
        this.data = data;
      });

    this.handleAutoRefreshStart();

    this.subscriptions.add(sortSubscription);
    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  extractData(element: TaskSummary, column: TaskSummaryColumnKey): any {
    if (column.startsWith('options.')) {
      const optionColumn = column.replace('options.', '') as keyof TaskOptions;
      const options = element['options'] as TaskOptions | undefined;

      if (!options) {
        return null;
      }

      return options[optionColumn];
    }

    return element[column as keyof TaskSummary];
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

  onRetries(task: TaskSummary): void {
    const filter: TaskSummaryFilter = {
      field: 'initialTaskId',
      value: task.id,
    };

    this.onFiltersChange([filter]);
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
    this.intervalValue = value;

    if(value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this.#tasksIndexService.saveIntervalValue(value);
  }

  onColumnsChange(columns: TaskSummaryColumnKey[]) {
    this.displayedColumns = [...columns];

    this.#tasksIndexService.saveColumns(columns);
  }

  onColumnsReset() {
    this.displayedColumns = this.#tasksIndexService.resetColumns();
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as TaskSummaryFilter[];

    this.#tasksIndexService.saveFilters(this.filters);
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset(): void{
    this.filters = this.#tasksIndexService.resetFilters();
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }

  onCancelTask(taskId: string): void {
    this.cancelTasks([taskId]);
  }

  onCancelTasksSelection():void {
    const tasksIds = this.selection.selected.map((task) => task.id);
    this.cancelTasks(tasksIds);
  }

  cancelTasks(tasksIds: string[]): void {
    this.#tasksGrpcService.cancel$(tasksIds).subscribe({
      complete: () => {
        this.#notificationService.success('Tasks canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this.#notificationService.error('Unable to cancel tasks');
      },
    });
  }

  columnsLabels(): Record<TaskSummaryColumnKey, string> {
    return this.#tasksIndexService.columnsLabels;
  }

  columnToLabel(column: TaskSummaryColumnKey): string {
    return this.#tasksIndexService.columnToLabel(column);
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

  handleAutoRefreshStart(): void {
    if(this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  autoRefreshTooltip(): string {
    return this.#autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  getIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this.#tasksIndexService.saveColumns(this.displayedColumns);
  }

  onCopiedTaskId() {
    this.#notificationService.success('Task ID copied to clipboard');
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;

    return numSelected === numRows;
  }

  toggleAllRows(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selection.select(...this.data);
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
}
