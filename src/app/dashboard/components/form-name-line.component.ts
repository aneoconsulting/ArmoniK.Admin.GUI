import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddLineDialogResult } from '@app/types/dialog';
import { LineType } from '../types';

@Component({
  selector: 'app-form-name-line',
  template: `
<form [formGroup]="lineForm" (ngSubmit)="onSubmit()">
  <mat-dialog-content>

    <mat-form-field appearance="outline">
      <mat-label for="name" i18n="Name of the statuses group"> Name </mat-label>
      <input matInput id="name" type="text" formControlName="name" i18n-placeholder="Placeholder" placeholder="Name of your line" required i18n="Input error">
      <mat-error *ngIf="lineForm.get('name')?.hasError('required')">
      Name is <strong>required</strong>
      </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label for="type"> Type </mat-label>
      <mat-select id="type" [value]="types" formControlName="type" required>
        <mat-option *ngFor="let option of types; trackByOption" [value]="option">{{option}}</mat-option>
      </mat-select>
      <mat-error *ngIf="lineForm.get('type')?.hasError('required')">
      Type is <strong>required</strong>
      </mat-error>
    </mat-form-field>

  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="onCancel()" type="button" i18n="Dialog action"> Cancel </button>
    <button mat-flat-button type="submit" color="primary" [disabled]="!lineForm.valid" i18n="Dialog action"> Confirm </button>
  </mat-dialog-actions>
</form>
  `,
  styles: [`
mat-dialog-content {
  padding-top: 0!important;
  overflow: visible!important;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
  `],
  standalone: true,
  providers: [
  ],
  imports: [
    NgIf,
    NgFor,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class FormNameLineComponent implements OnInit {
  @Input() line: string | null = null;
  @Input() type: string | null = null;
  types: LineType[] = ['CountStatus', 'Partitions'];

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<AddLineDialogResult>();

  lineForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    type: new FormControl('', [
      Validators.required
    ])
  });

  ngOnInit() {

    if(this.line && this.type) {
      this.lineForm.setValue({
        name: this.line,
        type: this.type
      });
    }

  }

  onSubmit() {
    const result = {
      name: this.lineForm.value.name ?? '',
      type: this.lineForm.value.type ?? ''
    } as AddLineDialogResult;
    this.submitChange.emit(result);
  }

  onCancel() {
    this.cancelChange.emit();
  }

  trackByStatus(_: number, item: { value: string, name: string }) {
    return item.value;
  }

  trackByOption(_: number, item: string) {
    return item;
  }
}
