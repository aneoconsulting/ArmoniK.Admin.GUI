import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-clear-all-dialog',
  templateUrl: './clear-all-dialog.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule
  ]
})
export class ClearAllDialogComponent {
}