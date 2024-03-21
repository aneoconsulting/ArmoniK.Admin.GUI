import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { DataRaw } from '@app/types/data';
import { ShowCardContentComponent } from './show-card-content.component';

@Component({
  selector: 'app-show-card',
  template: `
<mat-card>
  <mat-card-content>
    <mat-spinner *ngIf="!data" strokeWidth="4" diameter="40"/>
    <ng-container *ngIf="data">
      <app-show-card-content [data]="data" [statuses]="statuses"/>
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
export class ShowCardComponent<T extends DataRaw> implements OnInit {
  @Input({ required: true }) data$: Subject<T>;
  @Input() statuses: Record<number, string> = [];

  data: T | null = null;

  ngOnInit(): void {
    this.data$.subscribe(data => this.data = data);
  }
}
