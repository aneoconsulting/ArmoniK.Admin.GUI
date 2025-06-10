import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, CustomColumn, DataRaw } from '@app/types/data';
import { ColumnsModifyDialogData } from '@app/types/dialog';
import { ColumnsModifyAreaComponent } from './components/columns-modify-area.component';
import { CheckedColumn } from './type';

@Component({
  selector: 'app-add-columns-dialog',
  templateUrl:'./columns-modify-dialog.component.html',
  styleUrl: './columns-modify-dialog.component.css',
  standalone: true,
  imports: [
    MatGridListModule,
    MatDialogModule,
    MatButtonModule,
    ColumnsModifyAreaComponent,
  ]
})
export class ColumnsModifyDialogComponent<T extends DataRaw, O extends TaskOptions | null = null> {
  columnsLabels: Record<ColumnKey<T, O>, string>;

  commonColumns: ColumnKey<T, O>[] = [];
  dateColumns: ColumnKey<T, O>[] = [];
  objectArrayColumns: ColumnKey<T, O>[] = [];
  optionsColumns: ColumnKey<T, O>[] = [];
  customColumns: CustomColumn[] = [];

  selectedColumns: ColumnKey<T, O>[] = [];

  constructor(private dialogRef: MatDialogRef<ColumnsModifyDialogComponent<T, O>>, @Inject(MAT_DIALOG_DATA) private data: ColumnsModifyDialogData<T, O>) {
    this.selectedColumns = this.data.currentColumns;
    this.columnsLabels = this.data.columnsLabels;
    this.customColumns = this.data.customColumns;
    this.sortColumns(this.data.availableColumns);
  }

  private sortColumns(columns: TableColumn<T, O>[]) {
    columns.forEach(column => {
      if (!this.isCustomColumn(column) && this.isOptionsColumn(column)) {
        this.optionsColumns.push(column.key);
      } else if (column.type === 'date' || column.type === 'duration') {
        this.dateColumns.push(column.key);
      } else if (column.type === 'array' || column.type === 'object') {
        this.objectArrayColumns.push(column.key);
      } else {
        this.commonColumns.push(column.key);
      }
    });
  }

  private isOptionsColumn(column: TableColumn<T, O>): boolean {
    return column.key.toString().startsWith('options.');
  }

  private isCustomColumn(column: TableColumn<T, O>): boolean {
    return column.key.toString().startsWith('options.options.');
  }

  /**
   * Update the columns array when a checkbox is checked or unchecked
   * checked: add the column.
   * Unchecked: remove it
   */
  updateColumn({ checked, column }: CheckedColumn<T, O>): void {
    if (checked) {
      if (!this.selectedColumns.includes(column)) {
        this.selectedColumns.push(column);
      }
    } else if(this.selectedColumns.includes(column)) {
      this.selectedColumns = this.selectedColumns.filter(currentColumn => currentColumn !== column);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
