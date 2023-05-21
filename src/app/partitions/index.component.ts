import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { AppIndexComponent } from '@app/types/components';
import { ActionsToolbarComponent } from '@components/actions-toolbar.component';
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
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsIndexService } from './services/partitions-index.service';
import { PartitionRaw, PartitionRawColumn, PartitionRawFilter, PartitionRawFilterField, PartitionRawKeyField, PartitionRawListOptions } from './types';

@Component({
  selector: 'app-partitions-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" fontIcon="donut_small"></mat-icon>
  <span>Partitions</span>
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
      <ng-container *ngIf="column !== 'actions' && column !== 'id'">
        <td mat-cell *matCellDef="let element"> {{ element[column] }} </td>
      </ng-container>
      <!-- ID -->
      <ng-container *ngIf="column === 'id'">
        <td mat-cell *matCellDef="let element">
          <a mat-button [routerLink]="['/partitions', element[column]]">
            {{ element[column] }}
          </a>
        </td>
      </ng-container>
      <!-- Action -->
      <ng-container *ngIf="column === 'actions'">
        <td mat-cell *matCellDef="let element">
          <a mat-icon-button [routerLink]="['/partitions', element.id]" aria-label="See partition" matTooltip="See partition">
            <mat-icon aria-hidden="true" fontIcon="visibility"></mat-icon>
          </a>
        </td>
      </ng-container>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" aria-label="Select page of partitions">
    </mat-paginator>
</app-table-container>

<!-- TODO: Create pages to view only one item -->
<!-- TODO: Add icon before page title -->
<!-- TODO: Create folders in components folder -->
<!-- TODO: Create the settings page -->
  `,
  styles: [`
app-table-actions-toolbar {
  flex-grow: 1;
}
  `],
  standalone: true,
  providers: [
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    PartitionsIndexService,
    PartitionsGrpcService,
  ],
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    DragDropModule,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    TableLoadingComponent,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy, AppIndexComponent<PartitionRaw> {
  displayedColumns: PartitionRawColumn[] = [];
  availableColumns: PartitionRawColumn[] = [];

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
    private _tableService: TableService,
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

    this.sharableURL = this._partitionsIndexService.generateSharableURL(this.options, this.filters);
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
              active: this.sort.active as PartitionRawKeyField,
              direction: this.sort.direction,
            },
          };
          const filters = this.filters;

          this.sharableURL = this._partitionsIndexService.generateSharableURL(options, filters);
          this._partitionsIndexService.saveOptions(options);

          return this._partitionsGrpcService.list$(options, filters).pipe(catchError(() => of(null)));
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

  onColumnsChange(value: PartitionRawColumn[]) {
    this.displayedColumns = value;

    this._partitionsIndexService.saveColumns(value);
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
    return this._tableService.autoRefreshTooltip(this.intervalValue);
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
