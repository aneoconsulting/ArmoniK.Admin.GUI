import { Component, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';

import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
  imports: [ClarityModule, FormsModule, CommonModule],
})
export class SelectFilterComponent
  implements ClrDatagridFilterInterface<number>, OnDestroy
{
  changes = new EventEmitter<never>();

  @Input() name = '';
  @Input() selectedValue: number | null = 0;
  @Input() selectionList: { value: number; label: string }[] = [];

  get property(): string {
    return this.name;
  }

  get value(): number {
    return this.selectedValue ?? 0;
  }

  ngOnDestroy(): void {
    this.selectedValue = null;
  }

  onSelectionChange(): void {
    this.changes.emit();
  }

  clear(): void {
    this.selectedValue = 0;
    this.changes.emit();
  }

  reset(): void {
    this.selectedValue = null;
  }

  trackByLabel(_: number, item: { value: number; label: string }): string {
    return item.label;
  }

  /**
   * Check if the filter is active
   *
   * @returns true if yes, false if no
   */
  isActive(): boolean {
    return !!this.selectedValue && this.selectedValue !== 0;
  }

  /**
   * Not used but the interface needs it.
   *
   * @returns true
   */
  accepts(): boolean {
    return true;
  }
}
