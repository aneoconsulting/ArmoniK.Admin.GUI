import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
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
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { AppIndexComponent } from '@app/types/components';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
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
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsIndexService } from './services/partitions-index.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFieldKey, PartitionRawFilter, PartitionRawFilterField, PartitionRawListOptions } from './types';

@Component({
  selector: 'app-partitions-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('partitions')"></mat-icon>
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
    </app-table-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row>
    <app-filters-toolbar [filters]="filters" [filtersFields]="availableFiltersFields" [columnsLabels]="columnsLabels()" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
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
      <!-- Action -->
      <ng-container *ngIf="isActionsColumn(column)">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Actions">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <a mat-menu-item [routerLink]="['/partitions', element.id]">
              <mat-icon aria-hidden="true" fontIcon="visibility"></mat-icon>
              <span i18n>See partition</span>
            </a>
          </mat-menu>
        </td>
      </ng-container>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" aria-label="Select page of partitions" i18n-aria-label>
    </mat-paginator>
</app-table-container>
  `,
  styles: [`
app-table-actions-toolbar {
  flex-grow: 1;
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
  ],
  imports: [
    EmptyCellPipe,
    NoWrapDirective,
    NgIf,
    NgFor,
    RouterLink,
    DragDropModule,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    TableInspectObjectComponent,
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
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy, AppIndexComponent<PartitionRaw> {
  #notificationService = inject(NotificationService);

  displayedColumns: PartitionRawColumnKey[] = [];
  availableColumns: PartitionRawColumnKey[] = [];

  isLoading = true;
  data: PartitionRaw[] = [];
  total = 0;

  options: PartitionRawListOptions;

  filters: PartitionRawFilter[] = [];
  availableFiltersFields: PartitionRawFilterField[] = [];

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
    private _iconsService: IconsService,
    private _shareURLService: ShareUrlService,
    private _partitionsIndexService: PartitionsIndexService,
    private _partitionsGrpcService: PartitionsGrpcService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit() {
    this.displayedColumns = this._partitionsIndexService.restoreColumns();
    this.availableColumns = this._partitionsIndexService.availableColumns;

    this.options = this._partitionsIndexService.restoreOptions();

    this.availableFiltersFields = this._partitionsIndexService.availableFiltersFields;
    this.filters = this._partitionsIndexService.restoreFilters();

    this.intervalValue = this._partitionsIndexService.restoreIntervalValue();

    this.sharableURL = this._shareURLService.generateSharableURL(this.options, this.filters);
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

          this.sharableURL = this._shareURLService.generateSharableURL(options, filters);
          this._partitionsIndexService.saveOptions(options);

          return this._partitionsGrpcService.list$(options, filters).pipe(catchError((error) => {
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
    return this._partitionsIndexService.columnsLabels;
  }

  columnToLabel(column: PartitionRawColumnKey): string {
    return this._partitionsIndexService.columnToLabel(column);
  }

  isPartitionIdColumn(column: PartitionRawColumnKey): boolean {
    return this._partitionsIndexService.isPartitionIdColumn(column);
  }

  isActionsColumn(column: PartitionRawColumnKey): boolean {
    return this._partitionsIndexService.isActionsColumn(column);
  }

  isObjectColumn(column: PartitionRawColumnKey): boolean {
    return this._partitionsIndexService.isObjectColumn(column);
  }

  isNotSortableColumn(column: PartitionRawColumnKey): boolean {
    return this._partitionsIndexService.isNotSortableColumn(column);
  }

  isSimpleColumn(column: PartitionRawColumnKey): boolean {
    return this._partitionsIndexService.isSimpleColumn(column);
  }

  getIcon(name: Page): string {
    return this._iconsService.getPageIcon(name);
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

    this._partitionsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: PartitionRawColumnKey[]) {
    this.displayedColumns = [...data];

    this._partitionsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumns = this._partitionsIndexService.resetColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as PartitionRawFilter[];

    this._partitionsIndexService.saveFilters(filters as PartitionRawFilter[]);
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this._partitionsIndexService.resetFilters();
    this.refresh.next();
  }

  autoRefreshTooltip() {
    return this._autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._partitionsIndexService.saveColumns(this.displayedColumns);
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }
}
