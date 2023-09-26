import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationStatus } from '@app/types/notification';

@Injectable()
export class NotificationService {
  #snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.displaySnackBar(message, 'Close', 'success');
  }

  error(message: string): void {
    this.displaySnackBar(message, 'Close', 'error');
  }

  warning(message: string): void {
    this.displaySnackBar(message, 'Close', 'warning');
  }

  displaySnackBar(message: string, action: string, status: NotificationStatus) : void {
    this.#openSnackBar(message, action, status);
  }

  #openSnackBar(message: string, action: string, status: NotificationStatus): void {
    this.#snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'end',
      panelClass: status
    });
  }
}
