import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// TODO: Must be removed
@Component({
  selector: 'app-table-loading',
  template: `
  <div class="loading-shade" *ngIf="loading">
    <mat-spinner strokeWidth="4" diameter="40"></mat-spinner>
  </div>
  `,
  styles: [`
  .loading-shade {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 56px;
    right: 0;
    background: rgba(0, 0, 0, 0.20);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  `],
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule
  ]
})
export class TableLoadingComponent {
  @Input({ required: true }) loading: boolean;
}
