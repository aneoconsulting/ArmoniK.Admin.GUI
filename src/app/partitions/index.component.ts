import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActionsToolbarComponent } from '@components/actions-toolbar.component';
import { FiltersToolbarComponent } from '@components/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableContainerComponent } from '@components/table-container.component';
import { TableLoadingComponent } from '@components/table-loading.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { Observable, Subject, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { PartitionRawKeyField } from '@app/results/types';
import { AppIndexComponent } from '@app/types/components';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsIndexService } from './services/partitions-index.service';
import { PartitionRaw, PartitionRawColumn, PartitionRawFilter, PartitionRawFilterField, PartitionRawListOptions } from './types';

@Component({
  selector: 'app-partitions-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  Partitions
</app-page-header>

<mat-toolbar>
  <mat-toolbar-row>
    <app-actions-toolbar
      [refreshTooltip]="autoRefreshTooltip()"
      [intervalValue]="intervalValue"
      [displayedColumns]="displayedColumns"
      [availableColumns]="availableColumns"
      (refresh)="onRefresh()"
      (intervalValueChange)="onIntervalValueChange($event)"
      (displayedColumnsChange)="onColumnsChange($event)"
      (resetColumns)="onColumnsReset()"
      (resetFilters)="onFiltersReset()">
    </app-actions-toolbar>
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
          <a mat-icon-button aria-label="See application" matTooltip="See application">
            <mat-icon aria-hidden="true" fontIcon="visibility"></mat-icon>
          </a>
        </td>
      </ng-container>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" aria-label="Select page of applications">
    </mat-paginator>
</app-table-container>

<!-- TODO: Rework types -->
<!-- TODO: Rework applications -->
<!-- TODO: Add results (missing data fetching and allow add a type filters to support data) -->
<!-- TODO: Create pages to view only one item -->
<!-- TODO: Create folders in components folder -->
<!-- TODO: Create the settings page -->
  `,
  styles: [`
app-actions-toolbar {
  flex-grow: 1;
}
  `],
  standalone: true,
  providers: [
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
    DragDropModule,
    PageHeaderComponent,
    ActionsToolbarComponent,
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
export class IndexComponent implements OnInit, AfterViewInit, AppIndexComponent<PartitionRaw> {
  displayedColumns: PartitionRawColumn[] = [];
  availableColumns: PartitionRawColumn[] = [];

  data: PartitionRaw[] = [];
  total = 0;

  options: PartitionRawListOptions;

  filters: PartitionRawFilter[] = [];
  availableFiltersFields: PartitionRawFilterField[] = [];

  intervalValue = 0;

  sharableURL = '';

  isLoading = true;
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);

  constructor(private _tableService: TableService, private _partitionsIndexService: PartitionsIndexService, private _partitionsGrpcService: PartitionsGrpcService, private _autoRefreshService: AutoRefreshService) {}

  ngOnInit() {
    this.displayedColumns = this._partitionsIndexService.restoreColumns();
    this.availableColumns = this._partitionsIndexService.availableColumns;

    this.options = this._partitionsIndexService.restoreOptions();

    this.availableFiltersFields = this._partitionsIndexService.availableFiltersFields;
    this.filters = this._partitionsIndexService.restoreFilters();

    this.intervalValue = this._partitionsIndexService.restoreIntervalValue();

    this.sharableURL = this._partitionsIndexService.generateSharableURL(this.options);
    console.log(this.filters);
  }

  ngAfterViewInit(): void {
    // If the user change the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.refresh, this.interval$)
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

          this.sharableURL = this._partitionsIndexService.generateSharableURL(options);
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

  onFiltersReset() {
    this.filters = this._partitionsIndexService.resetFilters();
    this.refresh.next();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as PartitionRawFilter[];
    this._partitionsIndexService.saveFilters(this.filters);
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
