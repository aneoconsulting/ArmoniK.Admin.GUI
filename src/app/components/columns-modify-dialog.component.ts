import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, CustomColumn, DataRaw, PrefixedOptions } from '@app/types/data';
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
    MatGridListModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class ColumnsModifyDialogComponent<T extends DataRaw, O extends TaskOptions | null = null> implements OnInit {
  columns: ColumnKey<T, O>[] = [];
  columnsLabels: Record<ColumnKey<T, O>, string>;
  
  private _availableColumns: (keyof T | 'actions')[] = [];
  private _availableOptionsColumns: PrefixedOptions<O>[] = [];
  private _availableCustomColumns: string[] = [];

  /* Setters */

  set availableColumns(value: ColumnKey<T, O>[]) {
    this._availableColumns = value.filter(column => !column.toString().includes('.')).sort((a, b) => a.toString().localeCompare(b.toString())) as (keyof T | 'actions')[];
  }

  set availableOptionsColumns(value: ColumnKey<T, O>[]) {
    this._availableOptionsColumns = value.filter(column => !this.isCustomColumn(column) && column.toString().startsWith('options.')).sort((a, b) => a.toString().localeCompare(b.toString())) as PrefixedOptions<O>[];
  }

  set availableCustomColumns(value: ColumnKey<T, O>[]) {
    this._availableCustomColumns = value.filter(column => this.isCustomColumn(column)).sort((a, b) => a.toString().localeCompare(b.toString())).map((column) => column.toString().replace('options.options.', ''));
  }

  /* Getters */

  get availableColumns(): (keyof T | 'actions')[] {
    return this._availableColumns;
  }

  get availableOptionsColumns(): PrefixedOptions<O>[] {
    return this._availableOptionsColumns;
  }

  get availableCustomColumns(): string[] {
    return this._availableCustomColumns;
  }

  constructor(public dialogRef: MatDialogRef<ColumnsModifyDialogComponent<T, O>>, @Inject(MAT_DIALOG_DATA) public data: ColumnsModifyDialogData<T, O>){}

  ngOnInit(): void {
    // Create a copy in order to not modify the original array
    this.columns = [...this.data.currentColumns];
    this.columnsLabels = this.data.columnsLabels;
    this.availableColumns = this.data.availableColumns;
    this.availableOptionsColumns = this.data.availableColumns;
    this.availableCustomColumns = this.data.availableColumns;
  }

  toCustom(column: string): CustomColumn {
    return `options.options.${column}`;
  }

  isCustomColumn(column: ColumnKey<T, O>): boolean {
    return column.toString().startsWith('options.options.');
  }

  isSelected(column: ColumnKey<T, O>): boolean {
    return this.columns.includes(column);
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
      }
    } else if(this.columns.includes(column)) {
      this.columns = this.columns.filter(currentColumn => currentColumn !== column);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
