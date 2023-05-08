import { ApplicationRaw } from "@aneoconsultingfr/armonik.api.angular";
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import {ClipboardModule} from "@angular/cdk/clipboard";
import { NgForOf, NgIf } from "@angular/common";
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
import { catchError, map, merge, of, startWith, switchMap } from "rxjs";
import { FiltersDialogComponent } from "./components/filters-dialog.component";
import { ModifyColumnsDialogComponent } from "./components/modify-columns-dialog.component";
import { ApplicationsService } from "./services/applications.service";
import { TableStorageService } from "./services/table-storage.service";
import { TableURLService } from "./services/table-url.service";
import { TableService } from "./services/table.service";
import { ApplicationColumn, Filter, ListRequestOptions } from "./types";

@Component({
  selector: 'app-applications',
  template: `
<div class="header">
  <h1>Applications</h1>
  <!-- Create a component -->
  <button mat-icon-button aria-label="Share" [cdkCopyToClipboard]="sharableURL" (cdkCopyToClipboardCopied)="onCopied()" [disabled]="copied">
    <mat-icon aria-hidden="true" fontIcon="share" *ngIf="!copied"></mat-icon>
    <mat-icon aria-hidden="true" fontIcon="check" *ngIf="copied"></mat-icon>
  </button>
</div>

<mat-toolbar>
  <mat-toolbar-row>
    <!-- TODO: add an refresh and auto-refresh button -->
    <button mat-stroked-button (click)="openModifyColumnsDialog()">Modify Columns</button>
    <!-- Add a menu (vertical 3 dots) to reset columns, reset filter (delete local storage) and options (delete local storage and get default) -->
  </mat-toolbar-row>
  <mat-toolbar-row>
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
  options: ListRequestOptions

  sharableURL: string
  copied = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // We need to create a component for the filters

  constructor(private _dialog: MatDialog, private _applicationsService: ApplicationsService) {}

  ngOnInit(): void {
   this.displayedColumns = this._applicationsService.restoreColumns();

    this.options = this._applicationsService.restoreOptions();
    this.filters = this._applicationsService.restoreFilters();

    this.sharableURL = this._applicationsService.generateSharableURL(this.options);
  }

  ngAfterViewInit(): void {
    // If the user change the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
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
