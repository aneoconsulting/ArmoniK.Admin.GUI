import { ApplicationRaw } from "@aneoconsultingfr/armonik.api.angular";
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { NgForOf, NgIf } from "@angular/common";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from "@angular/material/toolbar";
import { ModifyColumnsDialogComponent } from "./components/modify-columns-dialog.component";
import { ApplicationsService } from "./services/applications.service";
import { TableService } from "./services/table.service";
import { ApplicationColumn, Filter } from "./types";
import { tap } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { FiltersDialogComponent } from "./components/filters-dialog.component";

@Component({
  selector: 'app-applications',
  template: `
<h1>Applications</h1>

<mat-toolbar>
  <mat-toolbar-row>
    <button mat-stroked-button (click)="openModifyColumnsDialog()">Modify Columns</button>
  </mat-toolbar-row>
  <mat-toolbar-row>
    <mat-chip-listbox aria-label="Filters view" *ngIf="filters.length > 0">
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
  <div class="loading-shade" *ngIf="!isApplicationsLoaded">
    <mat-spinner></mat-spinner>
  </div>
  <div class="table-container">
    <table mat-table [dataSource]="dataSource" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="drop($event)">
      <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
        <th mat-header-cell *matHeaderCellDef cdkDrag> {{ column }} </th>
        <td mat-cell *matCellDef="let element"> {{ element[column] }} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </div>

  <mat-paginator [length]="applicationsLength" [pageSize]="10" aria-label="Select page of applications"></mat-paginator>
</div>
  `,
  styles: [`
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
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ]
})
export class IndexComponent implements OnInit, AfterViewInit {
  filters: Filter[] = [];

  displayedColumns: ApplicationColumn[] = ['name', 'version'];

  isApplicationsLoaded = false;
  applicationsLength = 0;
  dataSource: ApplicationRaw.AsObject[] = [];

  constructor(private _dialog: MatDialog, private _tableService: TableService, private _applicationsService: ApplicationsService) {}

  ngOnInit(): void {
   const columns = this._tableService.restoreColumns('applications') as ApplicationColumn[];

    if (columns) {
      this.displayedColumns = columns;
    }
  }

  ngAfterViewInit(): void {
    this._applicationsService.listApplications()
      .pipe(tap(() => this.isApplicationsLoaded = false))
      .subscribe(data => {
        this.isApplicationsLoaded = true;
        this.applicationsLength = data.total ?? 0;
        this.dataSource = data.applications ?? [];
      });
  }

  /**
   * Open dialog to allow user to modify the columns
   */
  openModifyColumnsDialog(): void {
    const dialogRef = this._dialog.open(ModifyColumnsDialogComponent, {
      data: {
        currentColumns: this.displayedColumns,
        availableColumns: this.availableColumns()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.displayedColumns = result;
      this._saveColumns();
    });
  }

  /**
   * Open dialog to allow user to add filters
   */
  openFiltersDialog(): void {
    const dialogRef = this._dialog.open(FiltersDialogComponent, {
      data: {
        filters: this.filters,
        availableColumns: this.availableColumns()
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }

      this.filters = result;
    });
  }

  /**
   * Reorder the columns when a column is dropped
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    this._saveColumns();
  }

  availableColumns(): ApplicationColumn[] {
    return ['name', 'namespace', 'service', 'version'];
  }

  trackByFilter(index: number, filter: Filter): string {
    return filter.name ?? '';
  }

  private _saveColumns(): void {
    this._tableService.saveColumns('applications', this.displayedColumns);
  }

}
