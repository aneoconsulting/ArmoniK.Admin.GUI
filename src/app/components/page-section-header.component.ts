import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-section-header',
  template: `
<h2>
  <mat-icon *ngIf="icon" matListItemIcon aria-hidden="true" [fontIcon]="icon"></mat-icon>
  <span>
    <ng-content></ng-content>
  </span>
</h2>
  `,
  styles: [`
h2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
  `],
  standalone: true,
  providers: [],
  imports: [
    NgIf,
    MatIconModule
  ]
})
export class PageSectionHeaderComponent {
  @Input() icon: string | null = null;
}
