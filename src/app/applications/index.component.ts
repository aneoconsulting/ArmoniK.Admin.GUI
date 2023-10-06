import { FilterStringOperator, SessionTaskOptionEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-status.service';
import { TaskSummaryFiltersOr } from '@app/tasks/types';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TaskStatusColored, ViewTasksByStatusDialogData } from '@app/types/dialog';
import { Page } from '@app/types/pages';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersOperationService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { UtilsService } from '@services/utils.service';
import { ApplicationsFiltersService } from './services/applications-filters.service';
import { ApplicationsGrpcService } from './services/applications-grpc.service';
import { ApplicationsIndexService } from './services/applications-index.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFieldKey, ApplicationRawFilter, ApplicationRawListOptions } from './types';

@Component({
  selector: 'app-applications-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('applications')"></mat-icon>
  <span matListItemTitle i18n="Page title"> Applications </span>
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
      (resetFilters)="onFiltersReset()"
    >
      <ng-container extra-menu-items>
        <button mat-menu-item (click)="personalizeTasksByStatus()">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('tune')"></mat-icon>
          <span i18n appNoWrap>
            Personalize Tasks Status
          </span>
        </button>
      </ng-container>
    </app-table-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row class="filters">
    <app-filters-toolbar [filters]="filters" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<app-table-container>
  <table mat-table matSort [matSortActive]="options.sort.active" matSortDisableClear [matSortDirection]="options.sort.direction" [dataSource]="data" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="onDrop($event)">

    <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
      <!-- Header -->
      <th mat-header-cell mat-sort-header [disabled]="isNotSortableColumn(column)" *matHeaderCellDef cdkDrag appNoWrap>
        {{ columnToLabel(column) }}
      </th>
      <!-- Application Column -->
      <ng-container *ngIf="isSimpleColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          {{ element[column] | emptyCell }}
        </td>
      </ng-container>
      <!-- Application's Tasks Count by Status -->
      <ng-container *ngIf="isCountColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
        <app-count-tasks-by-status
          [statuses]="tasksStatusesColored"
          [queryParams]="createTasksByStatusQueryParams(element.name, element.version)"
          [filters]="countTasksByStatusFilters(element.name, element.version)"
        ></app-count-tasks-by-status>
        </td>
      </ng-container>
      <!-- Action -->
      <ng-container *ngIf="isActionsColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
         <button mat-icon-button [matMenuTriggerFor]="menu"
          aria-label="Actions" i18n-aria-label>
            <mat-icon [fontIcon]="getIcon('more')"></mat-icon>
         </button>
         <mat-menu #menu="matMenu">
            <a mat-menu-item [routerLink]="['/sessions']" [queryParams]="createViewSessionsQueryParams(element.name, element.version)">
              <mat-icon aria-hidden="true" [fontIcon]="getIcon('view')"></mat-icon>
              <span i18n>See session</span>
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

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of applications">
  </mat-paginator>
</app-table-container>
  `,
  styles: [`
app-table-actions-toolbar {
  flex-grow: 1;
}

.filters {
  height: auto;
  min-height: 64px;

  padding: 1rem;
}
  `],
  standalone: true,
  providers: [
    IconsService,
    ShareUrlService,
    QueryParamsService,
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    ApplicationsIndexService,
    ApplicationsGrpcService,
    NotificationService,
    TasksByStatusService,
    TasksIndexService,
    TasksStatusesService,
    FiltersOperationService,
    ApplicationsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: ApplicationsFiltersService
    }
  ],
  imports: [
    NoWrapDirective,
    EmptyCellPipe,
    NgIf,
    NgFor,
    RouterLink,
    DragDropModule,
    CountTasksByStatusComponent,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    TableEmptyDataComponent,
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly #tasksByStatusService = inject(TasksByStatusService);
  readonly #notificationService = inject(NotificationService);
  readonly #dialog = inject(MatDialog);
  readonly #iconsService = inject(IconsService);
  readonly #filtersOperationService = inject(FiltersOperationService);
  readonly #applicationsFiltersService = inject(DATA_FILTERS_SERVICE);

  displayedColumns: ApplicationRawColumnKey[] = [];
  availableColumns: ApplicationRawColumnKey[] = [];

  isLoading = true;
  data: ApplicationRaw[] = [];
  total = 0;

  options: ApplicationRawListOptions;

  filters: ApplicationRawFilter = [];

  intervalValue = 0;
  sharableURL = '';

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  tasksStatusesColored: TaskStatusColored[] = [];

  subscriptions: Subscription = new Subscription();

  constructor(
    private _shareURLService: ShareUrlService,
    private _applicationsIndexService: ApplicationsIndexService,
    private _applicationsGrpcService: ApplicationsGrpcService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this._applicationsIndexService.restoreColumns();
    this.availableColumns = this._applicationsIndexService.availableColumns;

    this.options = this._applicationsIndexService.restoreOptions();

    this.filters = this.#applicationsFiltersService.restoreFilters();

    this.intervalValue = this._applicationsIndexService.restoreIntervalValue();

    this.sharableURL = this._shareURLService.generateSharableURL(this.options, this.filters);

    this.tasksStatusesColored = this.#tasksByStatusService.restoreStatuses('applications');
  }

  ngAfterViewInit(): void {
    // If the user change the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    const mergeSubscription = merge(this.sort.sortChange, this.paginator.page, this.refresh, this.interval$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;

          const options: ApplicationRawListOptions = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sort: {
              active: this.sort.active as ApplicationRawFieldKey,
              direction: this.sort.direction,
            },
          };
          const filters = this.filters;

          this.sharableURL = this._shareURLService.generateSharableURL(options, filters);
          this._applicationsIndexService.saveOptions(options);

          return this._applicationsGrpcService.list$(options, filters).pipe(catchError((error) => {
            console.error(error);
            this.#notificationService.error('Unable to fetch applications');
            return of(null);
          }));
        }),
        map(data => {
          this.isLoading = false;
          this.total = data?.total ?? 0;

          const partitions = data?.applications ?? [];

          return partitions;
        })
      )
      .subscribe(data => {
        this.data = data;
      });

    this.handleAutoRefreshStart();

    this.subscriptions.add(sortSubscription);
    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  columnsLabels(): Record<ApplicationRawColumnKey, string> {
    return this._applicationsIndexService.columnsLabels;
  }

  columnToLabel(column: ApplicationRawColumnKey): string {
    return this._applicationsIndexService.columnToLabel(column);
  }

  isActionsColumn(column: ApplicationRawColumnKey): boolean {
    return this._applicationsIndexService.isActionsColumn(column);
  }

  isCountColumn(column: ApplicationRawColumnKey): boolean {
    return this._applicationsIndexService.isCountColumn(column);
  }

  isSimpleColumn(column: ApplicationRawColumnKey): boolean {
    return this._applicationsIndexService.isSimpleColumn(column);
  }

  isNotSortableColumn(column: ApplicationRawColumnKey): boolean {
    return this._applicationsIndexService.isNotSortableColumn(column);
  }

  getPageIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
    this.intervalValue = value;

    if (value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this._applicationsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: ApplicationRawColumnKey[]) {
    this.displayedColumns = [...data];

    this._applicationsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumns = this._applicationsIndexService.resetColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as ApplicationRawFilter;

    this.#applicationsFiltersService.saveFilters(filters as ApplicationRawFilter);
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this.#applicationsFiltersService.resetFilters();
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }

  autoRefreshTooltip() {
    return this._autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._applicationsIndexService.saveColumns(this.displayedColumns);
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  countTasksByStatusFilters(applicationName: string, applicationVersion: string): TaskSummaryFiltersOr {
    return [
      [
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
          value: applicationName,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        },
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
          value: applicationVersion,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        }
      ]
    ];
  }

  createTasksByStatusQueryParams(name: string, version: string) {
    return {
      [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: name,
      [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: version,
    };
  }

  createViewSessionsQueryParams(name: string, version: string) {
    return {
      [`0-options-${SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: name,
      [`0-options-${SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: version,
    };
  }

  personalizeTasksByStatus() {
    const dialogRef = this.#dialog.open<ViewTasksByStatusDialogComponent, ViewTasksByStatusDialogData>(ViewTasksByStatusDialogComponent, {
      data: {
        statusesCounts: this.tasksStatusesColored,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.tasksStatusesColored = result;
      this.#tasksByStatusService.saveStatuses('applications', result);
    });
  }
}
