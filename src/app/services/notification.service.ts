import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationStatus } from '@app/types/notification';

@Injectable()
export class NotificationService {
  #snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.#openSnackBar(message, 'Close', 'success');
  }

  error(message: string): void {
    this.#openSnackBar(message, 'Close', 'error');
  }

  warning(message: string): void {
    this.#openSnackBar(message, 'Close', 'warning');
  }

  #openSnackBar(message: string, action: string, status: NotificationStatus): void {
    this.#snackBar.open(message, action, {
      duration: 300000,
      horizontalPosition: 'end',
      panelClass: status
    });
  }
}
