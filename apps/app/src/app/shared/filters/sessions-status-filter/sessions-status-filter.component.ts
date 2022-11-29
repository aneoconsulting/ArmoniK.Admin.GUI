import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionStatus } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  selector: 'app-sessions-status-filter',
  templateUrl: './sessions-status-filter.component.html',
  styleUrls: ['./sessions-status-filter.component.scss'],
})
export class SessionsStatusFilterComponent
  implements ClrDatagridFilterInterface<number>, OnInit
{
  @Output() changes = new EventEmitter();

  @Input() selectedValue = 0;
  @Input() name = '';

  sessionStatus = SessionStatus;
  status: { value: SessionStatus; label: string }[];

  get property(): string {
    return this.name;
  }

  get value(): number {
    return this.selectedValue;
  }

  ngOnInit(): void {
    // Retrieve all status type
    this.status = [
      ...Object.keys(SessionStatus)
        .filter((key) => !Number.isInteger(parseInt(key)))
        .map((key) => ({
          value: SessionStatus[key as keyof typeof SessionStatus],
          label: key,
        })),
    ];
  }

  onSelectionChange(): void {
    this.changes.emit();
  }

  clear() {
    this.selectedValue = 0;
    this.changes.emit();
  }

  /**
   * Use to track status in ngFor loop.
   *
   * @param item
   * @returns string
   */
  trackByStatus(
    _: number,
    item: { value: SessionStatus; label: string }
  ): string {
    return item.label;
  }

  /**
   * Checks if the filter is active.
   */
  isActive(): boolean {
    return !!this.selectedValue && this.selectedValue !== 0;
  }

  /**
   * Required by the interface
   */
  accepts(): boolean {
    return true;
  }
}
