import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogData } from './type';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: 'confirmation.dialog.html',
  styleUrl: 'confirmation.dialog.css',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ]
})
export class ConfirmationDialogComponent {
  readonly defaultTitle = $localize`Please confirm`;
  readonly defaultActions = {
    cancel: $localize`No`,
    confirm: $localize`Yes`
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmationDialogData
  ) {}
}