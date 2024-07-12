import { Component, Input } from '@angular/core';
import { ShareUrlComponent } from './share-url.component';

@Component({
  selector: 'app-page-header',
  templateUrl:'./page-header.component.html',
  styles: [`
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 1rem;
}

.page-header h1 {
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

#header-right {
  display: flex;
  align-items: center;
}
  `],
  standalone: true,
  providers: [],
  imports: [
    ShareUrlComponent
  ]
})
export class PageHeaderComponent {
  @Input() sharableURL: string | null = null;
}
