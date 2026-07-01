import { Component, Input } from '@angular/core';
import { ShareUrlComponent } from './share-url.component';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: 'page-header.component.scss',
  providers: [],
  imports: [
    ShareUrlComponent
  ]
})
export class PageHeaderComponent {
  @Input() sharableURL: string | null = null;
}
