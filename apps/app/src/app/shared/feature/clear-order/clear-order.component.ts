import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-clear-order',
  templateUrl: './clear-order.component.html',
  styleUrls: ['./clear-order.component.scss'],
  imports: [TranslateModule],
})
export class ClearOrderComponent {
  @Output() clearOrderEvent = new EventEmitter<never>();

  public clearOrder(): void {
    this.clearOrderEvent.emit();
  }
}
