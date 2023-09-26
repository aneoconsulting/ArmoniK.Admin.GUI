import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ColumnKey } from '@app/types/data';
import { ColumnsModifyDialogData, ColumnsModifyDialogResult } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { ColumnsModifyDialogComponent } from './columns-modify-dialog.component';

@Component({
  selector: 'app-columns-button',
  template: `
<button mat-stroked-button (click)="openModifyColumnsDialog()">
  <mat-icon aria-hidden="true" [fontIcon]="getIcon('modify-columns')"></mat-icon>
  <span i18n="Open a dialog on click">Modify Columns</span>
</button>
  `,
  styles: [`
  `],
  standalone: true,
  imports: [
    ColumnsModifyDialogComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ColumnsButtonComponent<T extends object, O extends object> {
  #iconsService = inject(IconsService);

  @Input({ required: true }) columnsLabels: Record<ColumnKey<T, O>, string>;
  @Input({ required: true }) displayedColumns: ColumnKey<T, O>[] = [];
  @Input({ required: true }) availableColumns: ColumnKey<T, O>[];

  @Output() displayedColumnsChange: EventEmitter<ColumnKey<T, O>[]> = new EventEmitter<ColumnKey<T, O>[]>();

  constructor(private _dialog: MatDialog) { }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
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
