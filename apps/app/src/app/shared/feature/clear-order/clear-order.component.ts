import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-clear-order',
  templateUrl: './clear-order.component.html',
  styleUrls: ['./clear-order.component.scss'],
  imports: [TranslateModule],
})
export class ClearOrderComponent {

  @Input() clearOrderSubject: Subject<void>;

  public clearOrder(): void {
    this.clearOrderSubject.next();
  }
}
