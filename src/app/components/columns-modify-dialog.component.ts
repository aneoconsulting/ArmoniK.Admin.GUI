import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { ColumnKey, CustomColumn, PrefixedOptions, RawColumnKey } from '@app/types/data';
import { ColumnsModifyDialogData } from '@app/types/dialog';

@Component({
  selector: 'app-add-columns-dialog',
  templateUrl:'./columns-modify-dialog.component.html',
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
  columns: RawColumnKey[] = [];
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
    return !this.isCustomColumn(column) ? this.columnsLabels[column] ?? column.toString() : column.toString().replace('options.options.', '');
  }

  isCustomColumn(column: ColumnKey<T, O>): boolean {
    return column.toString().startsWith('options.options.');
  }

  /**
   * Get the available columns (all the columns that can be added)
   * Sort the columns alphabetically
   */
  availableColumns(): (keyof T | 'actions')[] {
    const columns = this.data.availableColumns.filter(column => !column.toString().includes('.')).sort((a, b) => a.toString().localeCompare(b.toString())) as (keyof T | 'actions')[];

    return columns;
  }

  /**
   * Get every Options column
   * Sort the columns alphabetically
   */
  availableOptionsColumns(): PrefixedOptions<O>[] {
    const columns = this.data.availableColumns.filter(column => !this.isCustomColumn(column as ColumnKey<T, O>) && column.toString().startsWith('options.')).sort((a, b) => a.toString().localeCompare(b.toString())) as PrefixedOptions<O>[];

    return columns;
  }

  /**
   * Get every custom column
   * Sort the columns alphabetically
   */
  availableCustomColumns(): CustomColumn[] {
    const columns = this.data.availableColumns.filter(column => column.toString().startsWith('options.options.')).sort((a, b) => a.toString().localeCompare(b.toString())) as CustomColumn[];
    return columns;
  }

  /**
   * Update the columns array when a checkbox is checked or unchecked
   * checked: add the column.
   * Unchecked: remove it
   */
  updateColumn({ checked }: MatCheckboxChange, column: ColumnKey<T, O>): void {
    if (checked) {
      if (!this.columns.includes(column as RawColumnKey) && this.data.availableColumns.includes(column as RawColumnKey)) {
        this.columns.push(column as RawColumnKey);
      }
    } else if(this.columns.includes(column as RawColumnKey)) {
      this.columns = this.columns.filter(currentColumn => currentColumn !== column);
    }
  }

  /**
   * Check if a column is selected
   */
  isSelected(column: ColumnKey<T, O>): boolean {
    return this.data.currentColumns.includes(column as RawColumnKey);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByColumn(_: number, column: ColumnKey<T, O>): string {
    return column.toString();
  }
}
