import { FilterStringOperator, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
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
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
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
import { PartitionsFiltersService } from './services/partitions-filters.service';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsIndexService } from './services/partitions-index.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFieldKey, PartitionRawFiltersOr, PartitionRawListOptions } from './types';

@Component({
  selector: 'app-partitions-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('partitions')"></mat-icon>
  <span i18n="Page title">Partitions</span>
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
      <!-- ID -->
      <ng-container *ngIf="isPartitionIdColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          {{ element[column] }}
        </td>
      </ng-container>
      <!-- Object -->
      <ng-container *ngIf="isObjectColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <app-table-inspect-object [object]="element[column]" [label]="columnToLabel(column)"></app-table-inspect-object>
        </td>
      </ng-container>
      <!-- Partition's Tasks Count by Status -->
      <ng-container *ngIf="isCountColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <app-count-tasks-by-status
            [statuses]="tasksStatusesColored"
            [queryParams]="createTasksByStatusQueryParams(element.id)"
            [filters]="countTasksByStatusFilters(element.id)"
          >
          </app-count-tasks-by-status>
        </td>
      </ng-container>
      <!-- Action -->
      <ng-container *ngIf="isActionsColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Actions">
            <mat-icon [fontIcon]="getIcon('more')"></mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <a mat-menu-item [routerLink]="['/partitions', element.id]">
              <mat-icon aria-hidden="true" [fontIcon]="getIcon('view')"></mat-icon>
              <span i18n>See partition</span>
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

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize"  [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of partitions" i18n-aria-label>
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
    PartitionsIndexService,
    PartitionsGrpcService,
    NotificationService,
    TasksByStatusService,
    TasksStatusesService,
    TasksIndexService,
    FiltersService,
    PartitionsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useClass: PartitionsFiltersService
    },
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
    TableInspectObjectComponent,
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
  readonly #notificationService = inject(NotificationService);
  readonly #iconsService = inject(IconsService);
  readonly #tasksByStatusService = inject(TasksByStatusService);
  readonly #shareURLService = inject(ShareUrlService);
  readonly #partitionsIndexService = inject(PartitionsIndexService);
  readonly #partitionsGrpcService = inject(PartitionsGrpcService);
  readonly #autoRefreshService = inject(AutoRefreshService);
  readonly #dialog = inject(MatDialog);
  readonly #filtersService = inject(FiltersService);
  readonly #partitionsFiltersService = inject(PartitionsFiltersService);

  displayedColumns: PartitionRawColumnKey[] = [];
  availableColumns: PartitionRawColumnKey[] = [];

  isLoading = true;
  data: PartitionRaw[] = [];
  total = 0;

  options: PartitionRawListOptions;

  filters: PartitionRawFiltersOr = [];

  intervalValue = 0;
  sharableURL = '';

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  tasksStatusesColored: TaskStatusColored[] = [];

  subscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.displayedColumns = this.#partitionsIndexService.restoreColumns();
    this.availableColumns = this.#partitionsIndexService.availableColumns;

    this.options = this.#partitionsIndexService.restoreOptions();

    this.filters = this.#partitionsFiltersService.restoreFilters();

    this.intervalValue = this.#partitionsIndexService.restoreIntervalValue();

    this.sharableURL = this.#shareURLService.generateSharableURL(this.options, this.filters);

    this.tasksStatusesColored = this.#tasksByStatusService.restoreStatuses('partitions');
  }

  ngAfterViewInit(): void {
    // If the user change the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    const mergeSubscription =  merge(this.sort.sortChange, this.paginator.page, this.refresh, this.interval$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;

          const options: PartitionRawListOptions = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sort: {
              active: this.sort.active as PartitionRawFieldKey,
              direction: this.sort.direction,
            },
          };
          const filters = this.filters;

          this.sharableURL = this.#shareURLService.generateSharableURL(options, filters);
          this.#partitionsIndexService.saveOptions(options);

          return this.#partitionsGrpcService.list$(options, filters).pipe(catchError((error) => {
            console.error(error);
            this.#notificationService.error('Unable to fetch partitions');
            return of(null);
          }));
        }),
        map(data => {
          this.isLoading = false;
          this.total = data?.total ?? 0;

          const partitions = data?.partitions ?? [];

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

  columnsLabels(): Record<PartitionRawColumnKey, string> {
    return this.#partitionsIndexService.columnsLabels;
  }

  columnToLabel(column: PartitionRawColumnKey): string {
    return this.#partitionsIndexService.columnToLabel(column);
  }

  isPartitionIdColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isPartitionIdColumn(column);
  }

  isActionsColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isActionsColumn(column);
  }

  isObjectColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isObjectColumn(column);
  }

  isCountColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isCountColumn(column);
  }

  isNotSortableColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isNotSortableColumn(column);
  }

  isSimpleColumn(column: PartitionRawColumnKey): boolean {
    return this.#partitionsIndexService.isSimpleColumn(column);
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  getPageIcon(page: Page): string {
    return this.#iconsService.getPageIcon(page);
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

    this.#partitionsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: PartitionRawColumnKey[]) {
    this.displayedColumns = [...data];

    this.#partitionsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumns = this.#partitionsIndexService.resetColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as PartitionRawFiltersOr;

    this.#partitionsFiltersService.saveFilters(filters as PartitionRawFiltersOr);
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this.#partitionsFiltersService.resetFilters();
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }

  autoRefreshTooltip() {
    return this.#autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this.#partitionsIndexService.saveColumns(this.displayedColumns);
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  countTasksByStatusFilters(partitionId: string): TaskSummaryFiltersOr {
    return [
      [
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
          value: partitionId,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        }
      ]
    ];
  }

  createTasksByStatusQueryParams(partition: string) {
    return {
      [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: partition,
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
      this.#tasksByStatusService.saveStatuses('partitions', result);
    });
  }
}
