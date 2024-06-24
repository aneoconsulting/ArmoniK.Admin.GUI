import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddLineDialogData, AddLineDialogResult } from '@app/types/dialog';
import { AutoCompleteComponent } from '@components/auto-complete.component';
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
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AutoCompleteComponent,
  ]
})
export class AddLineDialogComponent {
  type: LineType | undefined;
  types: LineType[] = ['CountStatus', 'Applications', 'Sessions', 'Tasks', 'Partitions', 'Results'];
  typeLabel = $localize`Type`;
  validType: boolean;

  formGroup = new FormGroup({
    name: new FormControl<string>('')
  });

  constructor(
    public _dialogRef: MatDialogRef<AddLineDialogComponent, AddLineDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data?: AddLineDialogData,
  ) {
    this.type = this.data?.type;
    this.validType = this.isValidType(this.type ?? '');
    this.formGroup.controls.name.setValue(this.data?.name ?? null);
  }

  onSubmit() {
    if (this.validType) {
      const result: AddLineDialogResult = {
        name: this.formGroup.getRawValue().name ?? '',
        type: this.type as LineType
      };
      this._dialogRef.close(result);
    }
  }

  onCancel(): void {
    this._dialogRef.close();
  }

  onTypeChange(value: string) {
    if (this.isValidType(value)) {
      this.type = value as LineType;
      this.validType = true;
    }
  }

  isValidType(value: string) {
    return this.types.includes(value as LineType);
  }
}
