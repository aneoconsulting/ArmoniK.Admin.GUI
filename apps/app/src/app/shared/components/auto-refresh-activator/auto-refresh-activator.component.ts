import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-auto-refresh-activator',
  templateUrl: './auto-refresh-activator.component.html',
  styleUrls: ['./auto-refresh-activator.component.scss'],
  imports: [TranslateModule],
})
export class AutoRefreshActivatorComponent {
  @Input() isEnabled: boolean | null = null;

  @Output() autoRefreshChange = new EventEmitter();

  onClick() {
    this.autoRefreshChange.emit();
  }
}
