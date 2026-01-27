import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ShowCardContentComponent } from '@components/show-card-content.component';

export interface TableInspectObjectDialogData {
  label: string;
  object: Record<string, unknown>;
}

/**
 * Dialog displaying an object. Called by the [TableInspectObjectComponent](./table-inspect-object.component.ts).
 */
@Component({
  selector: 'app-table-inspect-object-dialog',
  templateUrl: './table-inspect-object-dialog.component.html',
  imports: [
    ShowCardContentComponent,
    MatDialogModule,
    MatButtonModule
  ],
  providers: []
})
export class TableInspectObjectDialogComponent {
  /**
   * Title of the dialog.
   */
  label: string;

  /**
   * Object to display.
   */
  object: object | null = null;

  constructor(
    public readonly dialogRef: MatDialogRef<TableInspectObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: TableInspectObjectDialogData
  ) {
    this.label = data.label;
    this.object = data.object;
  }

  /**
   * Closes the dialog.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
