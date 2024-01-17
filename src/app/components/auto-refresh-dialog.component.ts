import { NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AutoRefreshDialogData } from '@app/types/dialog';

@Component({
  selector: 'app-auto-refresh-dialog',
  templateUrl: './auto-refresh-dialog.component.html',
  styles: [''],
  standalone: true,
  imports: [
    NgFor,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule
  ]
})
export class AutoRefreshDialogComponent implements OnInit {
  options = [$localize`:Dialog disabled@@autoRefreshDialog:Disabled`, 5, 10, 30, 60, 300, 600, 1800, 3600];

  value = 0;

  constructor(public dialogRef: MatDialogRef<AutoRefreshDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: AutoRefreshDialogData){}

  ngOnInit(): void {
    this.value = this.data.value;
  }

  onNumberChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this._setValue(target.value);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;

    this._setValue(value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private _setValue(value: number | string | null) {
    if (!value || value === 'Disabled') {
      this.value = 0;
    }

    value = Number(value);

    if (Number.isNaN(value)) {
      this.value = 0;
    }
    else {
      this.value = value;
    }
  }
}
