import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { AppIndexComponent } from '@app/types/components';
import { FiltersToolbarComponent } from '@components/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { TableLoadingComponent } from '@components/table-loading.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsIndexService } from './services/results-index.service';
import { ResultRaw, ResultRawColumnKey, ResultRawFieldKey, ResultRawFilter, ResultRawFilterField, ResultRawListOptions } from './types';

@Component({
  selector: 'app-results-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" fontIcon="workspace_premium"></mat-icon>
  <span>Results</span>
</app-page-header>

<mat-toolbar>
  <mat-toolbar-row>
    <app-table-actions-toolbar
      [refreshTooltip]="autoRefreshTooltip()"
      [intervalValue]="intervalValue"
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
    <app-filters-toolbar [filters]="filters" [filtersFields]="availableFiltersFields" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<app-table-container>
  <app-table-loading [loading]="isLoading"></app-table-loading>
  <table mat-table matSort [matSortActive]="options.sort.active" [matSortDirection]="options.sort.direction" [dataSource]="data" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="onDrop($event)">

    <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
      <!-- Header -->
      <th mat-header-cell mat-sort-header [disabled]="column === 'actions'" *matHeaderCellDef cdkDrag> {{ column }} </th>
      <!-- Application Column -->
      <ng-container *ngIf="column !== 'actions'">
        <td mat-cell *matCellDef="let element"> {{ element[column] }} </td>
      </ng-container>
      <!-- Action -->
      <ng-container *ngIf="column === 'actions'">
        <td mat-cell *matCellDef="let element">
          <a mat-icon-button aria-label="See result" matTooltip="See result">
            <mat-icon aria-hidden="true" fontIcon="visibility"></mat-icon>
          </a>
        </td>
      </ng-container>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" aria-label="Select page of results">
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
    StorageService,
    UtilsService,
    TableStorageService,
    TableURLService,
    TableService,
    ResultsIndexService,
    ResultsGrpcService,
    AutoRefreshService,
  ],
  imports: [
    NgIf,
    NgFor,
    DragDropModule,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    TableLoadingComponent,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy, AppIndexComponent<ResultRaw> {
  displayedColumns: ResultRawColumnKey[] = [];
  availableColumns: ResultRawColumnKey[] = [];

  isLoading = true;
  data: ResultRaw[] = [];
  total = 0;

  options: ResultRawListOptions;

  filters: ResultRawFilter[] = [];
  availableFiltersFields: ResultRawFilterField[] = [];

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
    private _tableService: TableService,
    private _resultsIndexService: ResultsIndexService,
    private _resultsGrpcService: ResultsGrpcService,
    private _autoRefreshService: AutoRefreshService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this._resultsIndexService.restoreColumns();
    this.availableColumns = this._resultsIndexService.availableColumns;

    this.options = this._resultsIndexService.restoreOptions();

    this.availableFiltersFields = this._resultsIndexService.availableFiltersFields;
    this.filters = this._resultsIndexService.restoreFilters();

    this.intervalValue = this._resultsIndexService.restoreIntervalValue();

    this.sharableURL = this._resultsIndexService.generateSharableURL(this.options, this.filters);
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

          this.sharableURL = this._resultsIndexService.generateSharableURL(options, filters);
          this._resultsIndexService.saveOptions(options);

          return this._resultsGrpcService.list$(options, filters).pipe(catchError(() => of(null)));
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

  onColumnsChange(value: ResultRawColumnKey[]) {
    this.displayedColumns = value;

    this._resultsIndexService.saveColumns(value);
  }

  onColumnsReset() {
    this.displayedColumns = this._resultsIndexService.resetColumns();
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as ResultRawFilter[];

    this._resultsIndexService.saveFilters(value as ResultRawFilter[]);
    this.refresh.next();
  }

  onFiltersReset(): void {
    this.filters = this._resultsIndexService.resetFilters();
    this.refresh.next();
  }

  autoRefreshTooltip() {
    return this._tableService.autoRefreshTooltip(this.intervalValue);
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
