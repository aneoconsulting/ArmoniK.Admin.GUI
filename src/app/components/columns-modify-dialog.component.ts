import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { ColumnKey, PrefixedOptions } from '@app/types/data';
import { ColumnsModifyDialogData } from '@app/types/dialog';

@Component({
  selector: 'app-add-columns-dialog',
  template: `
<h2 mat-dialog-title i18n="Dialog title">Modify Columns</h2>

<mat-dialog-content>
  <p i18n="Dialog description">Check box to add or remove a column</p>

  <div class="columns">
    <ng-container *ngFor="let column of availableColumns(); let index = index; trackBy:trackByColumn">
        <mat-checkbox [value]="column.toString()" (change)="updateColumn($event, column)" [checked]="isSelected(column)">
          {{ columnToLabel(column) }}
        </mat-checkbox>
    </ng-container>
  </div>

  <h2 i18n *ngIf="availableOptionsColumns().length">
    Options
  </h2>

  <div class="columns" *ngIf="availableOptionsColumns().length">
    <ng-container *ngFor="let column of availableOptionsColumns(); let index = index; trackBy:trackByColumn">
        <mat-checkbox [value]="optionsColumnValue(column)" (change)="updateColumn($event, column)" [checked]="isSelected(column)">
          {{ columnToLabel(column) }}
        </mat-checkbox>
    </ng-container>
  </div>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onNoClick()" i18n="Dialog action"> Cancel </button>
  <button mat-flat-button [mat-dialog-close]="columns" color="primary" i18n="Dialog action"> Confirm </button>
</mat-dialog-actions>
  `,
  styles: [`
  .columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  h2 {
    margin-top: 1rem;
  }
  `],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatGridListModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class ColumnsModifyDialogComponent<T extends object,O extends object> implements OnInit {
  columns: ColumnKey<T, O>[] = [];
  columnsLabels: Record<ColumnKey<T, O>, string>;

  constructor(public dialogRef: MatDialogRef<ColumnsModifyDialogComponent<T, O>>, @Inject(MAT_DIALOG_DATA) public data: ColumnsModifyDialogData<T, O>){}

  ngOnInit(): void {
    // Create a copy in order to not modify the original array
    this.columns = Array.from(this.data.currentColumns);
    this.columnsLabels = this.data.columnsLabels;
  }

  optionsColumnValue(column: string): string {
    return `options.${column}`;
  }

  columnToLabel(column: ColumnKey<T, O>): string {
    return this.columnsLabels[column] ?? column.toString();
  }

  /**
   * Get the available columns (all the columns that can be added)
   * Sort the columns alphabetically
   */
  availableColumns(): (keyof T | 'actions')[] {
    const columns = this.data.availableColumns.filter(column => !column.toString().startsWith('options.')).sort((a, b) => a.toString().localeCompare(b.toString())) as (keyof T | 'actions')[];

    return columns;
  }

  availableOptionsColumns(): PrefixedOptions<O>[] {
    const columns = this.data.availableColumns.filter(column => column.toString().startsWith('options.')).sort((a, b) => a.toString().localeCompare(b.toString())) as PrefixedOptions<O>[];

    return columns;
  }

  /**
   * Update the columns array when a checkbox is checked or unchecked
   * checked: add the column.
   * Unchecked: remove it
   */
  updateColumn({ checked }: MatCheckboxChange, column: ColumnKey<T, O>): void {
    if (checked) {
      if (!this.columns.includes(column) && this.data.availableColumns.includes(column)) {
        this.columns.push(column);
        this.data.availableColumns = this.data.availableColumns.filter(c => c !== column);
      }
    } else {
      if(this.columns.includes(column)) {
        this.columns = this.columns.filter(c => c !== column);
        this.data.availableColumns.push(column);
      }
    }
  }

  /**
   * Check if a column is selected
   */
  isSelected(column: ColumnKey<T, O>): boolean {
    return this.data.currentColumns.includes(column);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByColumn(_: number, column: ColumnKey<T, O>): string {
    return column.toString();
  }
}
