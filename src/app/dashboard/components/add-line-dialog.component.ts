import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, map, startWith } from 'rxjs';
import { AddLineDialogData, AddLineDialogResult } from '@app/types/dialog';
import { MaybeNull } from '@app/types/filters';
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
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
  ]
})
export class AddLineDialogComponent implements OnInit {

  types: LineType[] = ['CountStatus', 'Applications', 'Sessions', 'Tasks', 'Partitions', 'Results'];
  filteredTypes: Observable<LineType[]>;

  lineForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    type: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    public _dialogRef: MatDialogRef<AddLineDialogComponent, AddLineDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data?: AddLineDialogData,
  ) {}

  ngOnInit(): void {
    if(this.data?.name && this.data?.type) {
      this.lineForm.setValue({
        name: this.data.name,
        type: this.data.type
      });
    }

    this.filteredTypes = this.lineForm.controls.type.valueChanges.pipe(
      startWith(''),
      map(value => this.filterType(value))
    );
  }

  onSubmit() {
    const type = this.getType(this.lineForm.value.type);
    if (type) {
      const result = {
        name: this.lineForm.value.name ?? '',
        type: type
      } as AddLineDialogResult;
      this._dialogRef.close(result);
    } else {
      this.lineForm.controls.type.setErrors({ invalid: true });
    }
  }

  onCancel(): void {
    this._dialogRef.close();
  }

  onTypeSelected(event: MatAutocompleteSelectedEvent) {
    this.lineForm.controls.type.setValue(event.option.value);
  }

  private filterType(value: MaybeNull<string>): LineType[] {
    const filterValue = value?.toLowerCase();
    return this.types.filter(type => type.toLowerCase().includes(filterValue ?? ''));
  }

  private getType(type: string | null | undefined): LineType | undefined {
    return type ? this.types.find(t => t.toLowerCase() === type.toLowerCase()) : undefined;
  }
}
