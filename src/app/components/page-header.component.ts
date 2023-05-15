import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ShareUrlComponent } from './share-url.component';

@Component({
  selector: 'app-page-header',
  template: `
<div class="page-header">
  <h1> <ng-content></ng-content> </h1>

  <app-share-url *ngIf="sharableURL" [sharableURL]="sharableURL"> </app-share-url>
</div>
  `,
  styles: [`
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 1rem;
}

.page-header h1 {
  margin: 0;
}
  `],
  standalone: true,
  providers: [],
  imports: [
    NgIf,
    ShareUrlComponent
  ]
})
export class PageHeaderComponent {
  @Input() sharableURL: string | null = null;
}
