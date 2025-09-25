import { Component, Inject } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
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

  selectedColumns: FormArray<FormControl<ColumnKey<T, O>>>;

  constructor(
    private readonly dialogRef: MatDialogRef<ColumnsModifyDialogComponent<T, O>>,
    @Inject(MAT_DIALOG_DATA) private readonly data: ColumnsModifyDialogData<T, O>
  ) {
    this.selectedColumns = new FormArray(this.data.currentColumns.map((value) => {
      return new FormControl(value, {nonNullable: true});
    }));
    this.columnsLabels = this.data.columnsLabels;
    this.customColumns = this.data.customColumns;
    this.sortColumns(this.data.availableColumns);
  }

  private sortColumns(columns: TableColumn<T, O>[]) {
    for (const column of columns) {
      if (!this.isCustomColumn(column) && this.isOptionsColumn(column)) {
        this.optionsColumns.push(column.key);
      } else if (column.type === 'date' || column.type === 'duration') {
        this.dateColumns.push(column.key);
      } else if (column.type === 'array' || column.type === 'object') {
        this.objectArrayColumns.push(column.key);
      } else {
        this.commonColumns.push(column.key);
      }
    }
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
  selectOne(event: CheckedColumn<T, O>): void {
    const index = this.selectedColumns.value.findIndex((column) => event.column === column);
    if (event.checked) {
      if (index === -1) {
        this.selectedColumns.push(new FormControl(event.column, {nonNullable: true}));
      }
    } else if(index !== -1) {
      this.selectedColumns.removeAt(index);
    }
  }
  
  selectAll(columns: ColumnKey<T, O>[], event: boolean) {
    for (const column of columns) {
      const index = this.selectedColumns.value.findIndex((col) => column === col);
      if (index !== -1 && !event) {
        this.selectedColumns.removeAt(index);
      } else if (index === -1) {
        this.selectedColumns.push(new FormControl(column, { nonNullable: true }));
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
