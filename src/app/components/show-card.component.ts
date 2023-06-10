import { JsonPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-show-card',
  template: `
<mat-card>
  <mat-card-content>
    <mat-spinner *ngIf="!data" strokeWidth="4" diameter="40"></mat-spinner>
    <pre *ngIf="data">{{ data | json }}</pre>
  </mat-card-content>
  <!-- TODO: Update to show field prettier (using beautiful date, list for array and using label name for the other thing -->
  <!-- Create an object for label and translation -->
</mat-card>
  `,
  styles: [`
pre {
  margin-top: 0;
}
  `],
  standalone: true,
  providers: [
  ],
  imports: [
    NgIf,
    JsonPipe,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class ShowCardComponent<T> {
  @Input({ required: true }) data: T | null = null;
}
