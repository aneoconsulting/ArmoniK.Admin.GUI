import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { SplitLinesDialogData, SplitLinesDialogResult } from '@app/types/dialog';

@Component({
  selector: 'app-split-lines-dialog',
  template: `
<h2 mat-dialog-title i18n="Dialog title">Split lines</h2>

<mat-dialog-content>
  <p i18n="Dialog description">Indicate the number of columns for positioning lines.</p>

  <!-- TODO: use a form control to handle error -->
  <mat-form-field appearance="outline"  subscriptSizing="dynamic">
    <mat-label i18n="Label input">Number of columns</mat-label>
    <input matInput type="number" i18n-placeholder="Placeholder" placeholder="Number of columns" [value]="columns" (input)="updateColumns($event)">
  </mat-form-field>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onNoClick()" i18n="Dialog action"> Cancel </button>
  <button mat-flat-button [mat-dialog-close]="{ columns }" color="primary" i18n="Dialog action"> Confirm </button>
</mat-dialog-actions>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [],
  imports: [
    MatInputModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class SplitLinesDialogComponent implements OnInit {
  readonly #dialogRef = inject(MatDialogRef<SplitLinesDialogComponent, SplitLinesDialogResult>);

  columns: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SplitLinesDialogData,
  ) {}

  ngOnInit() {
    this.columns = this.data.columns;
  }

  updateColumns(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (!value) {
      return;
    }

    this.columns = parseInt(value, 10);
  }

  onNoClick(): void {
    this.#dialogRef.close();
  }
}
