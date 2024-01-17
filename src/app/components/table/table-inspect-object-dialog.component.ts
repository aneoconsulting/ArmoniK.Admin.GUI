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
  templateUrl: './table-inspect-object-dialog.component.html',
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
