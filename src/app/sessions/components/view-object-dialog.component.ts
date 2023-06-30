import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TaskOptions } from '@app/tasks/types';
import { ViewObjectDialogData } from '@app/types/dialog';
import { ShowCardContentComponent } from '@components/show-card-content.component';

@Component({
  selector: 'app-view-object-dialog',
  template: `
    <h2 mat-dialog-title i18n="Dialog title">{{ title }}</h2>

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
    MatButtonModule,
  ],
  providers: [],
})
export class ViewObjectDialogComponent implements OnInit {
  title = '';
  object: TaskOptions | null = null;

  constructor(public dialogRef: MatDialogRef<ViewObjectDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ViewObjectDialogData){}

  ngOnInit(): void {
    this.title = this.data.title;
    this.object = this.data.object;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
