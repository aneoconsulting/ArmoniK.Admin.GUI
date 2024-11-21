import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, DataRaw } from '@app/types/data';
import { ColumnsModifyDialogData, ColumnsModifyDialogResult } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { ColumnsModifyDialogComponent } from './columns-modify-dialog.component';

@Component({
  selector: 'app-columns-button',
  templateUrl: 'columns-button.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ColumnsButtonComponent<T extends DataRaw, O extends TaskOptions | null = null> {
  readonly iconsService = inject(IconsService);
  private readonly _dialog = inject(MatDialog);

  @Input({ required: true }) columnsLabels: Record<ColumnKey<T, O>, string>;
  @Input({ required: true }) displayedColumns: ColumnKey<T, O>[] = [];
  @Input({ required: true }) availableColumns: ColumnKey<T, O>[];
  @Input({ required: true}) disabled: boolean = false;

  @Output() displayedColumnsChange: EventEmitter<ColumnKey<T, O>[]> = new EventEmitter<ColumnKey<T, O>[]>();


  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  emit(result: ColumnsModifyDialogResult<T, O>): void {
    this.displayedColumnsChange.emit(result);
  }

  openModifyColumnsDialog(): void {
    const dialogRef = this._dialog.open<ColumnsModifyDialogComponent<T, O>, ColumnsModifyDialogData<T, O>, ColumnsModifyDialogResult<T, O>>(ColumnsModifyDialogComponent, {
      data: {
        columnsLabels: this.columnsLabels,
        currentColumns: this.displayedColumns,
        availableColumns: this.availableColumns,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.emit(result);
    });
  }
}
