import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pages-dashboard-cards-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() dotColor?: 'success' | 'warn' | 'error';

  getDotClass() {
    return this.dotColor ? `dot dot-${this.dotColor}` : '';
  }
}
