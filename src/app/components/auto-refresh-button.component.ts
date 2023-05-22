import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AutoRefreshDialogComponent } from '@components/auto-refresh-dialog.component';

@Component({
  selector: 'app-auto-refresh-button',
  template: `
<button mat-stroked-button (click)="openAutoRefreshDialog()">
  <mat-icon aria-hidden="true" fontIcon="autorenew"></mat-icon>
  <span>Set-up Auto Refresh</span>
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
  @Input({ required: true }) intervalValue: number;

  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _dialog: MatDialog) { }

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
