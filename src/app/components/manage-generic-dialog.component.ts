import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GenericColumn } from '@app/types/data';

@Component({
  selector: 'app-add-generic-col-dialog',
  standalone: true,
  templateUrl: './manage-generic-dialog.component.html',
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
export class ManageGenericColumnDialogComponent implements OnInit {

  existingColumnList: GenericColumn[];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(public dialogRef: MatDialogRef<ManageGenericColumnDialogComponent, GenericColumn[]>, @Inject(MAT_DIALOG_DATA) public data: GenericColumn[]) {}

  ngOnInit() {
    this.existingColumnList = this.data;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.existingColumnList.push(`generic.${value}`);
    }

    event.chipInput!.clear();
  }

  remove(column: GenericColumn): void {
    const index = this.existingColumnList.indexOf(column);

    if (index >= 0) {
      this.existingColumnList.splice(index, 1);
    }
  }

  edit(column: GenericColumn, event: MatChipEditedEvent) {
    const value = event.value.trim().replace('generic.', '');

    if (!value) {
      this.remove(column);
      return;
    }

    const index = this.existingColumnList.indexOf(column);
    if (index >= 0) {
      this.existingColumnList[index] = `generic.${value}`;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}