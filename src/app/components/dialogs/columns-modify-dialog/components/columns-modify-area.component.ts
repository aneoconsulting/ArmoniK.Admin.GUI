import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, DataRaw } from '@app/types/data';
import { CustomColumnPipe } from '@pipes/custom-column.pipe';
import { CheckedColumn } from '../type';

@Component({
  selector: 'app-columns-modify-area',
  templateUrl: 'columns-modify-area.component.html',
  styleUrl: '../columns-modify-dialog.component.css',
  standalone: true,
  imports: [
    MatCheckboxModule,
    CustomColumnPipe,
  ]
})
export class ColumnsModifyAreaComponent<T extends DataRaw, O extends TaskOptions | null = null> {
  @Input({ required: true }) selectedColumns: ColumnKey<T, O>[];
  @Input({ required: true }) columnsLabels: Record<ColumnKey<T, O>, string>;
  @Input({ required: true }) set columns(entry: ColumnKey<T, O>[]) {
    this.allColumns = entry;
    if (this.selectedColumns) {
      this.count = this.allColumns.filter((column) => this.isSelected(column)).reduce((acc) => acc + 1, 0);
    }
  }

  @Output() checked = new EventEmitter<CheckedColumn<T, O>>();

  allColumns: ColumnKey<T, O>[];
  count = 0;

  updateColumn({ checked }: MatCheckboxChange, column: ColumnKey<T, O>) {
    this.checked.emit({ column, checked });
    if (checked) {
      this.count += 1;
    } else if (this.count > 0) {
      this.count -= 1;
    }
  }

  isSelected(column: ColumnKey<T, O>): boolean {
    return this.selectedColumns.includes(column);
  }
}