import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatusColorPickerDialogData } from '@app/types/dialog';
import { Status, StatusLabelColor, StatusService } from '@app/types/status';
import { IconsService } from '@services/icons.service';
import { StatusColorPickerDialogComponent } from './status-color-picker.dialog.component';

@Component({
  selector: 'app-status-color-picker',
  templateUrl: 'status-color-picker.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  standalone: true,
})
export class StatusColorPickerComponent<S extends Status> {
  private readonly iconsService = inject(IconsService);
  private readonly dialog = inject(MatDialog);
  private readonly statusService = inject(StatusService);

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  openDialog() {
    const dialogRef = this.dialog.open<StatusColorPickerDialogComponent<S>, StatusColorPickerDialogData<S>, Record<S, StatusLabelColor>>(
      StatusColorPickerDialogComponent<S>,
      {
        data: {
          current: this.statusService.statuses,
          default: this.statusService.getDefault(),
          keys: this.statusService.keys,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.statusService.updateStatuses(result);
      }
    });
  }
}