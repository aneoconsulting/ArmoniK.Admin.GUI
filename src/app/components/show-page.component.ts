import { Component, Input } from '@angular/core';
import { PageHeaderComponent } from './page-header.component';
import { ShowCardComponent } from './show-card.component';

@Component({
  selector: 'app-show-page',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <ng-content> </ng-content> <span>{{ id }}</span>
</app-page-header>

<app-show-card [data]="data" [statuses]="statuses"></app-show-card>
  `,
  styles: [`
span {
  font-style: italic;
}
  `],
  standalone: true,
  providers: [
  ],
  imports: [
    PageHeaderComponent,
    ShowCardComponent,
  ]
})
export class ShowPageComponent<T extends object> {
  @Input({ required: true }) id: string | null = null;
  @Input({ required: true }) data: T | null = null;
  @Input() statuses: Record<number, string> = [];
  @Input() sharableURL: string | null = null;
}
