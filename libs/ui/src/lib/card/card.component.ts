import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() dot?: 'success' | 'warn' | 'danger';

  get dotClass() {
    return `dot dot-${this.dot}`;
  }
}
