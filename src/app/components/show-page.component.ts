import { Component, Input } from '@angular/core';
import { PageHeaderComponent } from './page-header.component';
import { ShowCardComponent } from './show-card.component';

@Component({
  selector: 'app-show-page',
  template: `
<app-page-header [sharableURL]="sharableURL">
  Partition <span>{{ id }}</span>
</app-page-header>

<app-show-card [data]="data"></app-show-card>
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
export class ShowPageComponent<T> {
  @Input({ required: true }) id: string | null = null;
  @Input({ required: true }) data: T | null = null;
  @Input() sharableURL: string | null = null;
}
