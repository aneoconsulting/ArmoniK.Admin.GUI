import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconsService } from '@services/icons.service';
import { TableInspectObjectDialogComponent, TableInspectObjectDialogData } from './table-inspect-object-dialog.component';

@Component({
  selector: 'app-table-inspect-object',
  templateUrl: './table-inspect-object.component.html',
  styles: [`
  `],
  standalone: true,
  imports: [
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  providers: [],
})
export class TableInspectObjectComponent
{
  @Input({ required: true }) object: Record<string, unknown> | undefined;
  @Input({ required: true }) label: string;

  #iconsService = inject(IconsService);
  #dialog = inject(MatDialog);

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  onViewObject(): void {
    if (this.object) {
      this.#dialog.open<TableInspectObjectDialogComponent, TableInspectObjectDialogData, void>(TableInspectObjectDialogComponent, {
        data: {
          label: this.label,
          object: this.object,
        },
      });
    }
  }

  get isObjectDefined(): boolean {
    return !!this.object && Object.keys(this.object).length !== 0;
  }
}
