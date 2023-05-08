import { NgForOf, NgIf } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ApplicationColumn, Filter, FiltersDialogData } from "../types";

@Component({
  selector: "app-filters-dialog",
  template: `
    <h2 mat-dialog-title>Filters</h2>

    <mat-dialog-content>
      <p>Build your filters</p>

      <div class="filters">
        <div class="filter" *ngFor="let filter of filters; let index = index; trackBy:trackByFilter">
          <span *ngIf="index === 0">Where</span>
          <span *ngIf="index > 0">And</span>
          <mat-form-field appearance="outline"  subscriptSizing="dynamic">
            <mat-label>Column</mat-label>
            <mat-select (valueChange)="onColumnChange(index, $event)" [value]="filter.name">
              <mat-option *ngFor="let column of availableColumns(); trackBy: trackByColumn" [value]="column" [disabled]="disableColumn(column)">
                {{ column }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <span>is</span>

          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label>Value</mat-label>
            <input matInput placeholder="Value" [value]="filter.value" (change)="onValueChange(index, $event)">
          </mat-form-field>

          <button mat-icon-button aria-label="More options" mat-tooltip="More options" [matMenuTriggerFor]="menu">
            <mat-icon aria-hidden="true" fontIcon="more_vert"></mat-icon>
          </button>

          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onClear(filter)">Clear</button>
            <button mat-menu-item (click)="onRemove(index)" [disabled]="filters.length === 1 && index === 0">Remove</button>
          </mat-menu>
        </div>
      </div>

      <button class="add-filter" mat-button (click)="addFilter()">
        <mat-icon aria-hidden="true" fontIcon="add" inline></mat-icon>
        <span>Add a filter rule</span>
      </button>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-flat-button [mat-dialog-close]="filters" color="primary">Valider</button>
    </mat-dialog-actions>
    `,
  styles: [`
  .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .filter {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .filter > span:first-child {
    min-width: 3rem;
    text-align: end;
  }

  .add-filter {
    margin-top: 1rem;
  }
  `],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
  ],
})
export class FiltersDialogComponent implements OnInit {
  filters: Filter[] = [];

  constructor(public dialogRef: MatDialogRef<FiltersDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: FiltersDialogData){}

  ngOnInit(): void {
    if (this.data.filters.length === 0) {
      this.addFilter();
      return;
    }

    this.filters = this.data.filters;
  }

  /**
   * Get the available columns (all the columns that can be added)
   * Sort the columns alphabetically
   */
  availableColumns(): ApplicationColumn[] {
    return this.data.availableColumns.sort();
  }

  addFilter(): void {
    this.filters.push({
      name: null,
      value: null
    });
  }

  onColumnChange(index: number, name: ApplicationColumn): void {
    this.filters[index].name = name;
  }

  onValueChange(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.filters[index].value = value;
  }

  onClear(filter: Filter): void {
    filter.value = null;
    filter.name = null;
  }

  onRemove(index: number): void {
    this.filters.splice(index, 1);
  }

  selectedColumn(filterName: ApplicationColumn, column: ApplicationColumn): boolean {
    return filterName === column;
  }

  disableColumn(column: ApplicationColumn): boolean {
    const usedColumns = this.filters.map(filter => filter.name);
    return usedColumns.includes(column);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByFilter(index: number, _: Filter) {
    return index;
  }

  trackByColumn(_: number, column: ApplicationColumn) {
    return column;
  }
}
