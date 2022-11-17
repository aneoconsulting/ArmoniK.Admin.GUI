import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClrDropdownModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-timer-interval-selector',
  templateUrl: './timer-interval-selector.component.html',
  styleUrls: ['./timer-interval-selector.component.scss'],
  imports: [ClrDropdownModule, TranslateModule],
})
export class TimerIntervalSelectorComponent {
  @Input() timer: number | null = 10_000;
  @Input() timersList: number[] = [10_000, 30_000, 60_000, 120_000];

  @Output() timerChange = new EventEmitter<number>();

  onClick(timer: number) {
    this.timerChange.emit(timer);
  }
}
