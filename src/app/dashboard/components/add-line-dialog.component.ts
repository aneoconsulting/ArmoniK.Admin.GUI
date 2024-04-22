import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddLineDialogData, AddLineDialogResult } from '@app/types/dialog';
import { LineType } from '../types';

@Component({
  selector: 'app-add-line-dialog',
  templateUrl: 'add-line-dialog.component.html',
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
  providers: [],
  imports: [
    MatDialogModule,
    NgIf,
    NgFor,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class AddLineDialogComponent implements OnInit {

  types: LineType[] = ['CountStatus', 'Applications', 'Sessions', 'Tasks', 'Partitions', 'Results'];

  lineForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    type: new FormControl<LineType | ''>('', [
      Validators.required
    ])
  });

  constructor(
    public _dialogRef: MatDialogRef<AddLineDialogComponent, AddLineDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: AddLineDialogData,
  ) {}

  ngOnInit(): void {
    if(this.data && this.data.name && this.data.type) {
      this.lineForm.setValue({
        name: this.data.name,
        type: this.data.type
      });
    }
  }

  onSubmit() {
    const result = {
      name: this.lineForm.value.name ?? '',
      type: this.lineForm.value.type ?? ''
    } as AddLineDialogResult;
    this._dialogRef.close(result);
  }

  onCancel(): void {
    this._dialogRef.close();
  }

  trackByType(_: number, item: LineType) {
    return item;
  }
}
