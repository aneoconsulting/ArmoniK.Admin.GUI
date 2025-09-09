import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-section-header',
  templateUrl: 'page-section-header.component.html',
  styleUrl: 'page-section-header.component.css',
  providers: [],
  imports: [
    MatIconModule
  ]
})
export class PageSectionHeaderComponent {
  @Input() icon: string | null = null;
}
