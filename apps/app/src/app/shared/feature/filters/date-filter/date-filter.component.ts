import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiltersEnum } from '@armonik.admin.gui/shared/data-access';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  standalone: true,
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  imports: [ClarityModule, FormsModule, CommonModule],
})
export class DateFilterComponent implements ClrDatagridFilterInterface<string> {
  readonly type = FiltersEnum.TIME;

  @Output() changes = new EventEmitter<never>();

  @Input() name = '';
  @Input() beforeDate: Date | null = null;
  @Input() afterDate: Date | null = null;

  get property(): { after: string; before: string } {
    return {
      before: this._propertyBefore,
      after: this._propertyAfter,
    };
  }

  private get _propertyBefore(): string {
    return `${this.name}Before`;
  }

  private get _propertyAfter(): string {
    return `${this.name}After`;
  }

  get value(): { before: number | null; after: number | null } {
    return {
      before: this.beforeDate ? this.beforeDate.getTime() : null,
      after: this.afterDate ? this.afterDate.getTime() : null,
    };
  }

  onDateChange() {
    this.changes.emit();
  }

  clear() {
    this.beforeDate = null;
    this.afterDate = null;
    this.changes.emit();
  }

  /**
   * Check if the filter is active
   */
  isActive(): boolean {
    return !!this.beforeDate || !!this.afterDate;
  }

  /**
   * Required by the interface
   */
  accepts(): boolean {
    return true;
  }
}
