import { NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ViewArrayDialogData } from '@app/types/dialog';

@Component({
  selector: 'app-view-array-dialog',
  template: `
    <h2 mat-dialog-title i18n="Dialog title">{{ title }}</h2>

    <mat-dialog-content>
      <ul>
        <li *ngFor="let item of array; trackBy:trackByItem">
          {{ item }}
        </li>
      </ul>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-flat-button (click)="onNoClick()" color="primary" i18n="Dialog action"> Close </button>
    </mat-dialog-actions>
  `,
  styles: [`
  `],
  standalone: true,
  imports: [
    NgFor,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [],
})
export class ViewArrayDialogComponent implements OnInit {
  title = '';
  array: string[] | null = null;

  constructor(public dialogRef: MatDialogRef<ViewArrayDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ViewArrayDialogData){}

  ngOnInit(): void {
    this.title = this.data.title;
    this.array = this.data.array;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByItem(index: number, item: string): string {
    return item;
  }
}
