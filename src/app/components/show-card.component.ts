import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShowCardContentComponent } from './show-card-content.component';

@Component({
  selector: 'app-show-card',
  template: `
<mat-card>
  <mat-card-content>
    <mat-spinner *ngIf="!data" strokeWidth="4" diameter="40"></mat-spinner>
    <ng-container *ngIf="data">
      <app-show-card-content [data]="data" [statuses]="statuses"></app-show-card-content>
    </ng-container>
  </mat-card-content>
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
    NgFor,
    JsonPipe,
    ShowCardContentComponent,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class ShowCardComponent<T extends object> {
  @Input({ required: true }) data: T | null = null;
  @Input() statuses: Record<number, string> = [];
}
