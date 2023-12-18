import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsIndexService } from './services/results-index.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw, ResultRawColumnKey, ResultRawFieldKey, ResultRawFiltersOr, ResultRawListOptions } from './types';


@Component({
  selector: 'app-results-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('results')"></mat-icon>
  <span i18n="Page title"> Results </span>
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
      [lockColumns]="lockColumns"
      (refresh)="onRefresh()"
      (intervalValueChange)="onIntervalValueChange($event)"
      (displayedColumnsChange)="onColumnsChange($event)"
      (resetColumns)="onColumnsReset()"
      (resetFilters)="onFiltersReset()"
      (lockColumnsChange)="onLockColumnsChange()"
      >
    </app-table-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row class="filters">
    <app-filters-toolbar [filters]="filters" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<app-table-container>
  <table mat-table matSort [matSortActive]="options.sort.active" recycleRows matSortDisableClear [matSortDirection]="options.sort.direction" [dataSource]="data" cdkDropList cdkDropListOrientation="horizontal" [cdkDropListDisabled]="lockColumns" (cdkDropListDropped)="onDrop($event)">

    <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
      <!-- Header -->
      <th mat-header-cell mat-sort-header [disabled]="isNotSortableColumn(column)" *matHeaderCellDef cdkDrag appNoWrap>
        {{ columnToLabel(column) }}
      </th>
      <!-- Columns -->
      <ng-container *ngIf="isSimpleColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          {{ element[column] | emptyCell }}
        </td>
      </ng-container>
      <!-- Session ID -->
      <ng-container *ngIf="isSessionIdColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <a mat-button
            [routerLink]="['/sessions']"
            [queryParams]="{
              sessionId: element[column],
            }"
          >
            {{ element[column] }}
          </a>
        </td>
      </ng-container>
      <!-- Date -->
      <ng-container *ngIf="isDateColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          {{ columnToDate(element[column]) | date: 'yyyy-MM-dd &nbsp;HH:mm:ss.SSS' }}
        </td>
      </ng-container>
      <!-- Status -->
      <ng-container *ngIf="isStatusColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <span> {{ statusToLabel(element[column]) }} </span>
        </td>
      </ng-container>
      <!-- Action -->
      <ng-container *ngIf="isActionsColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Actions">
            <mat-icon [fontIcon]="getIcon('more')"></mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <a mat-menu-item [routerLink]="['/results', element.resultId]">
              <mat-icon aria-hidden="true" [fontIcon]="getIcon('view')"></mat-icon>
              <span i18n> See result </span>
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

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of results" i18n-aria-label>
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
    ResultsStatusesService,
    IconsService,
    ShareUrlService,
    QueryParamsService,
    StorageService,
    UtilsService,
    TableStorageService,
    TableURLService,
    TableService,
    ResultsIndexService,
    ResultsGrpcService,
    AutoRefreshService,
    NotificationService,
    ResultsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: ResultsFiltersService,
    }
  ],
  imports: [
    NoWrapDirective,
    EmptyCellPipe,
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    DragDropModule,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    TableEmptyDataComponent,
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly #notificationService = inject(NotificationService);
  readonly #iconsService = inject(IconsService);
  readonly #resultsFiltersService = inject(DATA_FILTERS_SERVICE);

  displayedColumns: ResultRawColumnKey[] = [];
  availableColumns: ResultRawColumnKey[] = [];
  lockColumns: boolean = false;

  isLoading = true;
  data: ResultRaw[] = [];
  total = 0;

  options: ResultRawListOptions;

  filters: ResultRawFiltersOr = [];

  intervalValue = 0;
  sharableURL = '';

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  subscriptions: Subscription = new Subscription();

  constructor(
    private _resultsStatusesService: ResultsStatusesService,
    private _shareURLService: ShareUrlService,
    private _resultsIndexService: ResultsIndexService,
    private _resultsGrpcService: ResultsGrpcService,
    private _autoRefreshService: AutoRefreshService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this._resultsIndexService.restoreColumns();
    this.availableColumns = this._resultsIndexService.availableColumns;
    this.lockColumns = this._resultsIndexService.restoreLockColumns();

    this.options = this._resultsIndexService.restoreOptions();

    this.filters = this.#resultsFiltersService.restoreFilters();

    this.intervalValue = this._resultsIndexService.restoreIntervalValue();

    this.sharableURL = this._shareURLService.generateSharableURL(this.options, this.filters);
  }

  ngAfterViewInit(): void {
    // If the user change the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    const mergeSubscription = merge(this.sort.sortChange, this.paginator.page, this.refresh, this.interval$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;

          const options: ResultRawListOptions = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sort: {
              active: this.sort.active as ResultRawFieldKey,
              direction: this.sort.direction,
            }
          };
          const filters = this.filters;

          this.sharableURL = this._shareURLService.generateSharableURL(options, filters);
          this._resultsIndexService.saveOptions(options);

          return this._resultsGrpcService.list$(options, filters).pipe(catchError((error) => {
            console.error(error);
            this.#notificationService.error('Unable to fetch results');
            return of(null);
          }));
        }),
        map(data => {
          this.isLoading = false;
          this.total = data?.total ?? 0;

          const results = data?.results ?? [];

          return results;
        })
      ).subscribe(
        data => {
          this.data = data;
        });

    this.handleAutoRefreshStart();

    this.subscriptions.add(sortSubscription);
    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  columnsLabels(): Record<ResultRawColumnKey, string> {
    return this._resultsIndexService.columnsLabels;
  }

  columnToLabel(column: ResultRawColumnKey): string {
    return this._resultsIndexService.columnToLabel(column);
  }

  columnToDate(element: Timestamp | undefined): Date | null {
    if (!element) {
      return null;
    }

    return element.toDate();
  }

  dateColumns(): ResultRawColumnKey[] {
    return this._resultsIndexService.dateColumns;
  }

  statusToLabel(status: ResultStatus): string {
    return this._resultsStatusesService.statusToLabel(status);
  }

  getPageIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  isSessionIdColumn(column: ResultRawColumnKey): boolean {
    return this._resultsIndexService.isSessionIdColumn(column);
  }

  isActionsColumn(column: ResultRawColumnKey): boolean {
    return this._resultsIndexService.isActionsColumn(column);
  }

  isDateColumn(column: ResultRawColumnKey): boolean {
    return this._resultsIndexService.isDateColumn(column);
  }

  isStatusColumn(column: ResultRawColumnKey): boolean {
    return this._resultsIndexService.isStatusColumn(column);
  }

  isNotSortableColumn(column: ResultRawColumnKey): boolean {
    return this._resultsIndexService.isNotSortableColumn(column);
  }

  isSimpleColumn(column: ResultRawColumnKey): boolean {
    return this._resultsIndexService.isSimpleColumn(column);
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

    this._resultsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: ResultRawColumnKey[]) {
    this.displayedColumns = [...data];

    this._resultsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumns = this._resultsIndexService.resetColumns();
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as ResultRawFiltersOr;

    this.#resultsFiltersService.saveFilters(value as ResultRawFiltersOr);
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset(): void {
    this.filters = this.#resultsFiltersService.resetFilters();
    this.paginator.pageIndex = 0;
    this.refresh.next();
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this._resultsIndexService.saveLockColumns(this.lockColumns);
  }

  autoRefreshTooltip() {
    return this._autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._resultsIndexService.saveColumns(this.displayedColumns);
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }
}
