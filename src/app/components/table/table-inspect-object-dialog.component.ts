import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ShowCardContentComponent } from '@components/show-card-content.component';

export interface TableInspectObjectDialogData {
  label: string;
  object: Record<string, unknown>;
}

@Component({
  selector: 'app-table-inspect-object-dialog',
  template: `
<h2 mat-dialog-title>{{ label }}</h2>

<mat-dialog-content>
  <app-show-card-content [data]="object" [statuses]="[]"></app-show-card-content>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-flat-button (click)="onNoClick()" color="primary" i18n="Dialog action"> Close </button>
</mat-dialog-actions>
  `,
  styles: [`
  `],
  standalone: true,
  imports: [
    ShowCardContentComponent,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [],
})
export class TableInspectObjectDialogComponent implements OnInit {

  label = '';
  object: object | null = null;

  constructor(
    public dialogRef: MatDialogRef<TableInspectObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TableInspectObjectDialogData
  ) {}

  ngOnInit(): void {
    this.label = this.data.label;
    this.object = this.data.object;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
