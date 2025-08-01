import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AutoRefreshDialogData } from '@app/types/dialog';
import { AutoCompleteComponent } from './auto-complete.component';

@Component({
  selector: 'app-auto-refresh-dialog',
  templateUrl: './auto-refresh-dialog.component.html',
  styles: [''],
  imports: [
    MatDialogModule,
    MatButtonModule,
    AutoCompleteComponent,
  ]
})
export class AutoRefreshDialogComponent {
  options = [$localize`:Dialog disabled@@autoRefreshDialog:Disabled`, '5', '10', '30', '60', '300', '600', '1800', '3600'];

  value = 0;

  constructor(public dialogRef: MatDialogRef<AutoRefreshDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: AutoRefreshDialogData){
    this.value = this.data.value;
  }

  onNumberChange(value: string) {
    if (value.length === 0 || value === 'Disabled') {
      this.value = 0;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      this.value = 0;
    } else {
      this.value = number;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
