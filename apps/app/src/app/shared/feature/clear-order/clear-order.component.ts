import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-clear-order',
  templateUrl: './clear-order.component.html',
  styleUrls: ['./clear-order.component.scss'],
  imports: [TranslateModule, CommonModule],
})
export class ClearOrderComponent {
  @Input() isOrdered = false;
  @Output() clearOrderEvent = new EventEmitter<never>();

  public clearOrder(): void {
    this.clearOrderEvent.emit();
  }
}
