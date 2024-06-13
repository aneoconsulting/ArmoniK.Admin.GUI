import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { EditNameLineData } from '@app/types/dialog';

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
  nameForm: FormGroup;

  constructor(
    public _dialogRef: MatDialogRef<EditNameLineDialogComponent, string>,
    @Inject(MAT_DIALOG_DATA) public data: EditNameLineData,
  ) {}

  ngOnInit(): void {
    this.nameForm = new FormGroup({
      name: new FormControl(this.data.name, [
        Validators.required,
        Validators.minLength(1)
      ])
    });
  }

  onSubmit() {
    if (this.nameForm.invalid) {
      this._dialogRef.close(this.data.name);
    } else {
      const name = this.nameForm.value.name;
      this._dialogRef.close(name);
    }
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
