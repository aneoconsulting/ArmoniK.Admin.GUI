import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-graph-dialog',
  templateUrl: './warning-graph.dialog.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
  ]
})
export class WarningGraphDialogComponent {}