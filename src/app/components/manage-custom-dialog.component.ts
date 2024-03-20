import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { NgFor, NgIf } from '@angular/common';
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
    NgFor,
    NgIf,
    MatIconModule
  ]
})
export class ManageCustomColumnDialogComponent implements OnInit {

  existingColumnList: CustomColumn[];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(public dialogRef: MatDialogRef<ManageCustomColumnDialogComponent, CustomColumn[]>, @Inject(MAT_DIALOG_DATA) public data: CustomColumn[]) {}

  ngOnInit() {
    this.existingColumnList = this.data;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.existingColumnList.push(`custom.${value}`);
    }

    event.chipInput!.clear();
  }

  remove(column: CustomColumn): void {
    const index = this.existingColumnList.indexOf(column);

    if (index >= 0) {
      this.existingColumnList.splice(index, 1);
    }
  }

  edit(column: CustomColumn, event: MatChipEditedEvent) {
    const value = event.value.trim().replace('custom.', '');

    if (!value) {
      this.remove(column);
      return;
    }

    const index = this.existingColumnList.indexOf(column);
    if (index >= 0) {
      this.existingColumnList[index] = `custom.${value}`;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}