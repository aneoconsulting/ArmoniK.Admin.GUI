import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() dotColor?: 'success' | 'warn' | 'error';

  getDotClass() {
    return this.dotColor ? `dot dot-${this.dotColor}` : '';
  }
}
