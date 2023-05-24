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
import { TaskStatusService } from '@app/tasks/services/task-status.service';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { TableLoadingComponent } from '@components/table-loading.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { CountByStatusComponent } from './components/count-by-status.component';
import { ApplicationsGrpcService } from './services/applications-grpc.service';
import { ApplicationsIndexService } from './services/applications-index.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFieldKey, ApplicationRawFilter, ApplicationRawFilterField, ApplicationRawListOptions } from './types';

@Component({
  selector: 'app-applications-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('applications')"></mat-icon>
  <span matListItemTitle i18n="Page title"> Applications </span>
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
      <th mat-header-cell mat-sort-header [disabled]="column === 'actions' || column === 'count'" *matHeaderCellDef cdkDrag> {{ column }} </th>
      <!-- Application Column -->
      <ng-container *ngIf="column !== 'actions' && column !== 'count'">
        <td mat-cell *matCellDef="let element"> {{ element[column] }}
      </td>
      </ng-container>
      <!-- Application's Tasks Count by Status -->
      <ng-container *ngIf="column === 'count'">
        <td mat-cell *matCellDef="let element">
         <app-count-by-status [name]="element.name" [version]="element.version"></app-count-by-status>
        </td>
      </ng-container>
      <!-- Action -->
      <ng-container *ngIf="column === 'actions'">
        <td mat-cell *matCellDef="let element">
         <em i18n> No actions available </em>
        </td>
      </ng-container>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" aria-label="Select page of applications">
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
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    ApplicationsIndexService,
    ApplicationsGrpcService,
  ],
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    DragDropModule,
    CountByStatusComponent,
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
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: ApplicationRawColumnKey[] = [];
  availableColumns: ApplicationRawColumnKey[] = [];


  isLoading = true;
  data: ApplicationRaw[] = [];
  total = 0;

  options: ApplicationRawListOptions;

  filters: ApplicationRawFilter[] = [];
  availableFiltersFields: ApplicationRawFilterField[] = [];


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
    private _applicationsIndexService: ApplicationsIndexService,
    private _applicationsGrpcService: ApplicationsGrpcService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this._applicationsIndexService.restoreColumns();
    this.availableColumns = this._applicationsIndexService.availableColumns;

    this.options = this._applicationsIndexService.restoreOptions();

    this.availableFiltersFields = this._applicationsIndexService.availableFiltersFields;
    this.filters = this._applicationsIndexService.restoreFilters();

    this.intervalValue = this._applicationsIndexService.restoreIntervalValue();

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
            // TODO: Error management need to be improved (we can create a snackbar for example)
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

    this._applicationsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(value: ApplicationRawColumnKey[]) {
    this.displayedColumns = value;

    this._applicationsIndexService.saveColumns(value);
  }

  onColumnsReset() {
    this.displayedColumns = this._applicationsIndexService.resetColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as ApplicationRawFilter[];

    this._applicationsIndexService.saveFilters(filters as ApplicationRawFilter[]);
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this._applicationsIndexService.resetFilters();
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
}
