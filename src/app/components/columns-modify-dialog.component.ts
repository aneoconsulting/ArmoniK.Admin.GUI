import { NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { ColumnKey } from '@app/types/data';
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
  `],
  standalone: true,
  imports: [
    NgFor,
    MatGridListModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class ColumnsModifyDialogComponent<T extends object> implements OnInit {
  columns: ColumnKey<T>[] = [];
  columnsLabels: Record<ColumnKey<T>, string>;

  constructor(public dialogRef: MatDialogRef<ColumnsModifyDialogComponent<T>>, @Inject(MAT_DIALOG_DATA) public data: ColumnsModifyDialogData<T>){}

  ngOnInit(): void {
    // Create a copy in order to not modify the original array
    this.columns = Array.from(this.data.currentColumns);
    this.columnsLabels = this.data.columnsLabels;
  }

  columnToLabel(column: ColumnKey<T>): string {
    return this.columnsLabels[column];
  }

  /**
   * Get the available columns (all the columns that can be added)
   * Sort the columns alphabetically
   */
  availableColumns(): ColumnKey<T>[] {
    return this.data.availableColumns.sort();
  }

  /**
   * Update the columns array when a checkbox is checked or unchecked
   */
  updateColumn({ checked }: MatCheckboxChange, column: ColumnKey<T>): void {
    if (checked) {
      this.columns.push(column);
    } else {
      this.columns = this.columns.filter(c => c !== column);
    }
  }

  /**
   * Check if a column is selected
   */
  isSelected(column: ColumnKey<T>): boolean {
    return this.data.currentColumns.includes(column);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByColumn(_: number, column: ColumnKey<T>): string {
    return column.toString();
  }
}
