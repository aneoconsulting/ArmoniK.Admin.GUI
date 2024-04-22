import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { EditNameLineData, EditNameLineResult } from '@app/types/dialog';

@Component({
  selector: 'app-edit-name-line-dialog',
  templateUrl: 'edit-name-line-dialog.component.html',
  standalone: true,
  providers: [
  ],
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ]
})
export class EditNameLineDialogComponent implements OnInit  {
  name: string;
  nameForm: FormGroup;

  constructor(
    public _dialogRef: MatDialogRef<EditNameLineDialogComponent, EditNameLineResult>,
    @Inject(MAT_DIALOG_DATA) public data: EditNameLineData,
  ) {}

  ngOnInit(): void {
    this.name = this.data.name;
    this.nameForm = new FormGroup({
      name: new FormControl(this.name, [
        Validators.required,
        Validators.minLength(1)
      ])
    });
  }

  onSubmit() {
    const name = this.nameForm.get('name')?.value;
    this._dialogRef.close(name ?? this.name);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
