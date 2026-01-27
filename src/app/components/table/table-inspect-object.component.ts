
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconsService } from '@services/icons.service';
import { TableInspectObjectDialogComponent, TableInspectObjectDialogData } from './table-inspect-object-dialog.component';

/**
 * Table cell that helps display objects. Displays itself as an "eye" button that opens a dialog with the object content on click.
 * Used for options, custom data...
 */
@Component({
  selector: 'app-table-inspect-object',
  templateUrl: './table-inspect-object.component.html',
  imports: [
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: []
})
export class TableInspectObjectComponent
{
  /**
   * Required input. Object to display in the dialog.
   */
  @Input({ required: true }) set object(entry: Record<string, unknown> | undefined) {
    this._object = entry;
    this.isObjectDefined = !!entry && Object.keys(entry).length !== 0;
  }
  
  private _object: Record<string, unknown> | undefined;

  /**
   * check if the provided object is defined.
   */
  isObjectDefined: boolean = false;

  /**
   * Required input. Title of the dialog.
   */
  @Input({ required: true }) label: string;

  private readonly iconsService = inject(IconsService);
  private readonly dialog = inject(MatDialog);

  /**
   * Retrieves the angular material icon associated to this name.
   * @param name string, name of the icon
   * @returns string, material angular name of the icon
   */
  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  /**
   * Opens the dialog displaying the object.
   */
  onViewObject(): void {
    if (this._object) {
      this.dialog.open<TableInspectObjectDialogComponent, TableInspectObjectDialogData, void>(TableInspectObjectDialogComponent, {
        data: {
          label: this.label,
          object: this._object,
        },
      });
    }
  }
}
