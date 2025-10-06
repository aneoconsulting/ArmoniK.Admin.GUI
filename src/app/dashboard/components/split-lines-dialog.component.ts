import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { SplitLinesDialogData, SplitLinesDialogResult } from '@app/types/dialog';

@Component({
  selector: 'app-split-lines-dialog',
  templateUrl: 'split-lines-dialog.component.html',
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
