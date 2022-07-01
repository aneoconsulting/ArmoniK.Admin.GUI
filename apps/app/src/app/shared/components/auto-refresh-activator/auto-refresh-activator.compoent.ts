import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auto-refresh-activator',
  templateUrl: './auto-refresh-activator.component.html',
  styleUrls: ['./auto-refresh-activator.component.scss'],
})
export class AutoRefreshActivatorComponent {
  @Input() isEnabled: ReturnType<typeof setInterval> | null = null;

  @Output() autoRefreshChange = new EventEmitter();

  onClick() {
    this.autoRefreshChange.emit();
  }
}
