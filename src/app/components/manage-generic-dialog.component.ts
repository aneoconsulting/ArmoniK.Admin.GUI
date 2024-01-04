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
  template: `
  <h2 mat-dialog-title i18n="Dialog title" i18n>Generic Columns</h2>

  <mat-dialog-content>
    <p i18n="Dialog description">
      Enter the generic (options.options) field you want to add as a column.
      <br>
      The field is case sensitive and will not show any data if it is incorrect.
    </p>

  <mat-form-field class="example-chip-list">
    <mat-label i18n>Existing Generics</mat-label>
      <mat-chip-grid #chipGrid aria-label="Enter generic">
      <mat-chip-row 
        *ngFor="let column of existingColumnList"
        (removed)="remove(column)"
        [editable]="true"
        (edited)="edit(column, $event)"
        color="primary"
        i18n-aria-description
        aria-description="press enter to edit">
        {{column}}
        <button matChipRemove [attr.aria-label]="'remove ' + column">
          <mat-icon i18n>cancel</mat-icon>
        </button>
      </mat-chip-row>
      <input i18n-placeholder placeholder="New generic..."
            [matChipInputFor]="chipGrid"
            [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
            [matChipInputAddOnBlur]="true"
            (matChipInputTokenEnd)="add($event)"/>
      </mat-chip-grid>
</mat-form-field>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="onNoClick()" i18n="Dialog action">Cancel</button>
    <button mat-flat-button [mat-dialog-close]="existingColumnList" color="primary" i18n="Dialog action"> Confirm </button>
  </mat-dialog-actions>
  `,
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