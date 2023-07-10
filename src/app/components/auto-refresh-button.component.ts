import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AutoRefreshDialogComponent } from '@components/auto-refresh-dialog.component';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-auto-refresh-button',
  template: `
<button mat-stroked-button (click)="openAutoRefreshDialog()">
  <mat-icon aria-hidden="true" [fontIcon]="getIcon('auto-refresh')"></mat-icon>
  <span i18n="Open a dialog on click">Set up Auto Refresh</span>
</button>
  `,
  styles: [`

  `],
  standalone: true,
  imports: [
    AutoRefreshButtonComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class AutoRefreshButtonComponent {
  #iconsService = inject(IconsService);

  @Input({ required: true }) intervalValue: number;

  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _dialog: MatDialog) { }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  openAutoRefreshDialog(): void {
    // Get value from the storage
    const dialogRef = this._dialog.open(AutoRefreshDialogComponent, {
      data: {
        value: this.intervalValue
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value === undefined) {
        return;
      }

      this.intervalValueChange.emit(value);
    });
  }
}
