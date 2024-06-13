import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CustomColumn } from '@app/types/data';

@Component({
  selector: 'app-add-custom-col-dialog',
  standalone: true,
  templateUrl: './manage-custom-dialog.component.html',
  styles: [`
  mat-form-field {
    width: 100%
  }
  `],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ]
})
export class ManageCustomColumnDialogComponent implements OnInit {

  existingColumnList: CustomColumn[];
  displayedColumnsList: string[] = [];

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(public dialogRef: MatDialogRef<ManageCustomColumnDialogComponent, CustomColumn[]>, @Inject(MAT_DIALOG_DATA) public data: CustomColumn[]) {}

  ngOnInit() {
    this.existingColumnList = this.data;
    this.displayedColumnsList = this.data.map(column => column.replace('options.options.', ''));
  }

  add(event: MatChipInputEvent): void {
    let value = (event.value || '').trim() as `options.options.${string}`;

    if (value.length === 0) {
      return;
    }

    if (!value.startsWith('options.options.')) {
      value = `options.options.${value}`;
    }

    if (value && !this.existingColumnList.includes(value)) {
      this.existingColumnList.push(value);
      const test = value.replace('options.options.', '');
      this.displayedColumnsList.push(test);
    }

    event.chipInput!.clear();
  }

  remove(column: string): void {
    const index = this.displayedColumnsList.indexOf(column);

    if (index >= 0) {
      this.existingColumnList.splice(index, 1);
      this.displayedColumnsList.splice(index, 1);
    }
  }

  edit(column: string, event: MatChipEditedEvent) {
    const value = event.value.trim().replace('options.options.', '');

    if (!value) {
      this.remove(column);
      return;
    }

    const index = this.displayedColumnsList.indexOf(column);
    if (index >= 0) {
      if (this.displayedColumnsList.includes(value)) {
        this.remove(column);
      } else {
        this.existingColumnList[index] = `options.options.${value}`;
        this.displayedColumnsList[index] = value;
      }
      
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}