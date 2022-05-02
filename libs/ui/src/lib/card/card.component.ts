import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() dot?: { base: string; dark: string };

  get dotColor() {
    if (!this.dot) return {};
    return {
      'background-color': 'hsl(' + this.dot.base + ')',
      color: 'hsl(' + this.dot.dark + ')',
    };
  }
}
