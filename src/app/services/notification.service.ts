import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationStatus } from '@app/types/notification';

@Injectable()
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly warnings = new Set();
  /**
   * Send a message to the function that display the success notification bar and display it in UI.
   * @param message string
   */
  success(message: string): void {
    this.openSnackBar(message, 'Close', 'success');
  }
  /**
   * Send a message to the function that display the error notification bar and display it in UI.
   * @param message 
   */
  error(message: string): void {
    this.openSnackBar(message, 'Close', 'error');
  }
  /**
   * Send a message to the function that display the warning notification bar and display it in UI.
   * @param message String
   */
  warning(message: string): void {
    if (!this.warnings.has(message)) {
      this.openSnackBar(message, 'Close', 'warning');
      this.warnings.add(message);
    }
  }
  /**
   * 
   * Display in UI a little notification bar with different statuses and messages for users.
   * @param message String
   * @param action String
   * @param status Object type Notification status 
   */
  openSnackBar(message: string, action: string, status: NotificationStatus): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'end',
      panelClass: status
    });
  }
}
