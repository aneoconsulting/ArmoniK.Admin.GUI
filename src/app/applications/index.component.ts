import { ApplicationRaw } from '@aneoconsultingfr/armonik.api.angular';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AutoRefreshDialogComponent } from '@components/auto-refresh-dialog.component';
import { ColumnsModifyDialogComponent } from '@components/columns-modify-dialog.component';
import { FiltersChipsComponent } from '@components/filters-chips.component';
import { FiltersDialogComponent } from '@components/filters-dialog.component';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { ShareUrlComponent } from '@components/share-url.component';
import { TableLoadingComponent } from '@components/table-loading.component';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { Observable, Subject, catchError, filter, interval, map, merge, of, startWith, switchMap, takeUntil } from 'rxjs';
import { ApplicationsService } from './services/applications.service';
import { ApplicationColumn, Filter, FilterField, ListApplicationsOptions } from './types';

@Component({
  selector: 'app-applications',
  template: `
<div class="header">
  <h1>Applications</h1>
  <app-share-url [sharableURL]="sharableURL"></app-share-url>
</div>

<mat-toolbar>
  <mat-toolbar-row class="actions">
    <!-- TODO: move the tooltip to a function -->
    <app-refresh-button (refreshChange)="onRefresh()" [tooltip]="!intervalValue ? 'Auto Refresh Disabled' : 'Auto Refresh: ' + intervalValue + ' seconds'"></app-refresh-button>

    <div class="buttons-container">
      <button mat-stroked-button (click)="openAutoRefreshDialog()">
        <mat-icon aria-hidden="true" fontIcon="autorenew"></mat-icon>
        <span>Set-up Auto Refresh</span>
      </button>
      <button mat-stroked-button (click)="openModifyColumnsDialog()">
        <mat-icon aria-hidden="true" fontIcon="view_column"></mat-icon>
        <span>Modify Columns</span>
      </button>
      <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Show more options">
        <mat-icon aria-hidden="true" fontIcon="more_vert"></mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="resetColumns()">Reset Columns</button>
        <!-- Currently, it's impossible to reset sort programmatically. -->
        <button mat-menu-item (click)="resetFilters()">Reset Filters</button>
      </mat-menu>
    </div>
  </mat-toolbar-row>
  <mat-toolbar-row>
    <app-filters-chips *ngIf="showFilters()" [filters]="filters" class="current-filters">
    </app-filters-chips>
    <button mat-button (click)="openFiltersDialog()">
      <mat-icon aria-hidden="true" fontIcon="add"></mat-icon>
      <span>Manage filters</span>
    </button>
  </mat-toolbar-row>
</mat-toolbar>

<div class="container">
  <app-table-loading [loading]="isLoading"></app-table-loading>
  <div class="table-container">
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
  </div>

    <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" aria-label="Select page of applications">
    </mat-paginator>
  </div>
  `,
  styles: [`
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 1rem;
  }

  .header h1 {
    margin: 0;
  }

  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .buttons-container > button + button {
    margin-left: 1rem;
  }

  .buttons-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .container {
    position: relative;
  }

  .table-container {
    position: relative;
    overflow: auto;
  }

  [mat-header-cell] {
    text-transform: capitalize;
  }
  `],
  standalone: true,
  providers: [
    ApplicationsService,
    TableStorageService,
    TableURLService,
    TableService,
  ],
  imports: [
    ShareUrlComponent,
    RefreshButtonComponent,
    FiltersChipsComponent,
    TableLoadingComponent,
    NgForOf,
    NgIf,
    DragDropModule,
    ClipboardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule
  ]
})
export class IndexComponent implements OnInit, AfterViewInit {
  filters: Filter[] = [];

  displayedColumns: ApplicationColumn[] = [];

  isLoading = true;
  data: ApplicationRaw.AsObject[] = [];
  total = 0;
  options: ListApplicationsOptions;

  sharableURL: string;
  copied = false;

  intervalValue = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  // TODO: Create a function in a service (auto-refresh.service.ts) (dry)
  interval$: Observable<number> = merge(
    this.stopInterval,
    this.interval
  ).pipe(
    filter((interval) => {
      if (!interval) {
        return false;
      }
      // Interval can be 0 but we don't want to start the timer
      return true;
    }),
    switchMap((value) => {
      return interval((value as number) * 1000).pipe(takeUntil(this.stopInterval));
    }),
  );

  // We need to create a component for the filters

  constructor(private _dialog: MatDialog, private _applicationsService: ApplicationsService) {}

  ngOnInit(): void {
    this.displayedColumns = this._applicationsService.restoreColumns();

    this.options = this._applicationsService.restoreOptions();
    this.filters = this._applicationsService.restoreFilters();
    this.intervalValue = this._applicationsService.restoreIntervalValue();

    this.sharableURL = this._applicationsService.generateSharableURL(this.options);
  }

  ngAfterViewInit(): void {
    // If the user change the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.refresh, this.interval$)
    // Add a way to stop and restart the interval when the value change (check for previous gui)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;

          const findFilter = (name: string) => {
            return this.filters.find(filter => filter.field === name)?.value ?? '';
          };

          const options: ListApplicationsOptions = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sort: {
              active: this.sort.active as FilterField,
              direction: this.sort.direction,
            },
            filters: {
              name: findFilter('name'),
              namespace: findFilter('namespace'),
              version: findFilter('version'),
              service: findFilter('service'),
            }
          };

          this.sharableURL = this._applicationsService.generateSharableURL(options);
          this._applicationsService.saveOptions(options);

          // TODO: Brancher les filtres et les saves ici (et depuis les subscribe, envoyer next sur refresh)
          return this._applicationsService.list(options).pipe(catchError(() => of(null)));
        }),
        map(data => {
          this.isLoading = false;
          this.total = data?.total ?? 0;

          const applications = data?.applications ?? [];

          return applications;
        })
      )
      .subscribe(data => {
        this.data = data;
      });

    // We need to start the timer after the first load
    // TODO: Create a function
    if (this.intervalValue === 0) {
      this.refresh.next(); // We need to manually trigger the first load
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  /**
   * Open dialog to allow user to modify the columns
   */
  openModifyColumnsDialog(): void {
    const dialogRef = this._dialog.open(ColumnsModifyDialogComponent, {
      data: {
        currentColumns: this.displayedColumns,
        availableColumns: this._applicationsService.availableColumns
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.displayedColumns = result;

      this._applicationsService.saveColumns(this.displayedColumns);
    });
  }

  /**
   * Open dialog to setup auto refresh
   */
  openAutoRefreshDialog(): void {
    // Get value from the storage
    const dialogRef = this._dialog.open(AutoRefreshDialogComponent, {
      data: {
        value: this.intervalValue
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value === undefined) {
        return;
      }

      this.intervalValue = value;

      if (value === 0) {
        this.stopInterval.next();
      } else {
        this.interval.next(value);
        // Refresh immediately
        this.refresh.next();
      }

      this._applicationsService.saveIntervalValue(this.intervalValue);
    });
  }

  /**
   * Open dialog to allow user to add filters
   */
  openFiltersDialog(): void {
    const dialogRef = this._dialog.open(FiltersDialogComponent, {
      data: {
        filters: this.filters,
        availableFiltersFields: this._applicationsService.filtersFields
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }

      this.filters = result;

      this._applicationsService.saveFilters(this.filters);

      this.refresh.next();
    });
  }

  resetFilters(): void {
    this.filters = this._applicationsService.resetFilters();
    this.refresh.next();
  }

  resetColumns(): void {
    this.displayedColumns = this._applicationsService.resetColumns();
  }

  onRefresh() {
    this.refresh.next();
  }

  showFilters(): boolean {
    return  this.filters.length > 1 || (this.filters[0]?.value !== null && this.filters.length === 1);
  }

  /**
   * Reorder the columns when a column is dropped
   */
  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._applicationsService.saveColumns(this.displayedColumns);
  }
}
