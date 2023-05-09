import { ApplicationRaw } from "@aneoconsultingfr/armonik.api.angular";
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import {ClipboardModule} from "@angular/cdk/clipboard";
import { JsonPipe, NgForOf, NgIf } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Observable, Subject, catchError, filter, interval, map, merge, of, startWith, switchMap, takeUntil, tap, timer } from "rxjs";
import { FiltersDialogComponent } from "./components/filters-dialog.component";
import { ModifyColumnsDialogComponent } from "./components/modify-columns-dialog.component";
import { ApplicationsService } from "./services/applications.service";
import { TableStorageService } from "./services/table-storage.service";
import { TableURLService } from "./services/table-url.service";
import { TableService } from "./services/table.service";
import { ApplicationColumn, Filter, ListApplicationsOptions } from "./types";
import { MatMenuModule } from "@angular/material/menu";
import { AutoRefreshDialogComponent } from "./components/auto-refresh-dialog.component";

@Component({
  selector: 'app-applications',
  template: `
<div class="header">
  <h1>Applications</h1>
  <!-- TODO: Create a component -->
  <button mat-icon-button aria-label="Share" [cdkCopyToClipboard]="sharableURL" (cdkCopyToClipboardCopied)="onCopied()" [disabled]="copied">
    <mat-icon aria-hidden="true" fontIcon="share" *ngIf="!copied"></mat-icon>
    <mat-icon aria-hidden="true" fontIcon="check" *ngIf="copied"></mat-icon>
  </button>
</div>

<mat-toolbar>
  <mat-toolbar-row class="actions">
    <button mat-flat-button color="primary" (click)="onRefresh()" [matTooltip]="!intervalValue ? 'Auto Refresh Disabled' : 'Auto Refresh: ' + intervalValue + ' seconds'">
      <mat-icon aria-hidden="true" fontIcon="refresh"></mat-icon>
      <span>Refresh</span>
    </button>

    <div>
      <button mat-stroked-button (click)="openAutoRefreshDialog()">Setup Auto Refresh</button>
      <button mat-stroked-button (click)="openModifyColumnsDialog()">Modify Columns</button>
    </div>
    <!-- Add a menu (vertical 3 dots) to reset columns, reset filter (bottom right) (delete local storage) and options (delete local storage and get default) -->
  </mat-toolbar-row>
  <mat-toolbar-row>
    <!-- TODO: Create a component -->
    <mat-chip-listbox aria-label="Filters view" *ngIf="filters.length > 0 && filters[0].name !== null">
        <ng-container *ngFor="let filter of filters; let index = index; trackBy:trackByFilter">
        <mat-chip [matTooltip]="filter.value ? 'Value: ' + filter.value: 'No value'">
          <span> {{ filter.name }} </span>
        </mat-chip>
      </ng-container>
    </mat-chip-listbox>
    <button mat-button (click)="openFiltersDialog()">
      <mat-icon aria-hidden="true" fontIcon="add"></mat-icon>
      <span>Manage filters</span>
    </button>
  </mat-toolbar-row>
</mat-toolbar>

<div class="container">
  <div class="loading-shade" *ngIf="isLoading">
    <mat-spinner></mat-spinner>
  </div>
  <div class="table-container">
    <table mat-table matSort [matSortActive]="options.sort.active" [matSortDirection]="options.sort.direction" [dataSource]="data" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="onDrop($event)">
      <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
        <th mat-header-cell mat-sort-header *matHeaderCellDef cdkDrag> {{ column }} </th>
        <td mat-cell *matCellDef="let element"> {{ element[column] }} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </div>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" aria-label="Select page of applications"></mat-paginator>
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

  button + button {
    margin-left: 1rem;
  }

  .container {
    position: relative;
  }

  .table-container {
    position: relative;
    overflow: auto;
  }

  .loading-shade {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 56px;
    right: 0;
    background: rgba(0, 0, 0, 0.15);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  mat-chip-listbox + button {
    margin-left: 1rem;
  }
  `],
  standalone: true,
  providers: [
    ApplicationsService,
    TableStorageService,
    TableURLService,
    TableService,
    {
      provide: Storage,
      useValue: localStorage
    }
  ],
  imports: [
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
  options: ListApplicationsOptions

  sharableURL: string
  copied = false;

  intervalValue: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  // TODO: Create a function in a service (dry)
  interval$: Observable<number> = merge(
        this.stopInterval,
        this.interval
      ).pipe(
        tap(console.log),
        filter((interval) => {
          if (!interval) {
            return false
          }
          // Interval can be 0 but we don't want to start the timer
          return true
        }),
        switchMap((interval) => {
          return timer(0, (interval as number) * 1000).pipe(takeUntil(this.stopInterval))
        }),
        tap(console.log),
      )

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
      // startWith({}),
      switchMap(() => {
        this.isLoading = true

        const options = {
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          sort: {
            active: this.sort.active as ApplicationColumn,
            direction: this.sort.direction,
          }
        }

        this.sharableURL = this._applicationsService.generateSharableURL(options);
        this._applicationsService.saveOptions(options);

        // TODO: Brancher les filtres et les saves ici (et depuis les subscribe, envoyer un merge)
        return this._applicationsService.listApplications(options).pipe(catchError(() => of(null)))
      }),
      map(data => {
        this.isLoading = false;
        this.total = data?.total ?? 0;

        return data?.applications ?? [];
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
    const dialogRef = this._dialog.open(ModifyColumnsDialogComponent, {
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
    })

    dialogRef.afterClosed().subscribe(value => {
      if (value === undefined) {
        return;
      }

      this.intervalValue = value

      if (value === 0) {
        this.stopInterval.next();
      } else {
        this.interval.next(value);
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
        availableColumns: this._applicationsService.availableColumns
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }

      this.filters = result;

      this._applicationsService.saveFilters(this.filters);
    });
  }

  onRefresh() {
    this.refresh.next();
  }

  /**
   * Reorder the columns when a column is dropped
   */
  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._applicationsService.saveColumns(this.displayedColumns);
  }

  onCopied() {
    this.copied = true;

    setTimeout(() => this.copied = false, 1000);
  }

  trackByFilter(_: number, filter: Filter): string {
    return filter.name ?? '';
  }
}
