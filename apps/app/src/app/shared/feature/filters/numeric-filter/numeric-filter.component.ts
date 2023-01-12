import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';
import { FiltersEnum } from '@armonik.admin.gui/shared/data-access';

@Component({
  standalone: true,
  selector: 'app-numeric-filter',
  templateUrl: './numeric-filter.component.html',
  styleUrls: ['./numeric-filter.component.scss'],
  imports: [ClarityModule, FormsModule, CommonModule],
})
export class NumericFilterComponent
  implements ClrDatagridFilterInterface<number>
{
  @Input() name = '';
  @Input() minValue: number | null = null;
  @Input() maxValue: number | null = null;

  @Output() changes = new EventEmitter<never>();

  get property(): { min: string; max: string } {
    return {
      min: this._minProperty,
      max: this._maxProperty,
    };
  }

  get value(): { min: number | null; max: number | null } {
    return {
      min: this.minValue,
      max: this.maxValue,
    };
  }

  get type(): FiltersEnum {
    return FiltersEnum.NUMERIC;
  }

  private get _minProperty(): string {
    return `${this.name}Min`;
  }

  private get _maxProperty(): string {
    return `${this.name}Max`;
  }

  onChange() {
    this.changes.emit();
  }

  clear() {
    this.maxValue = null;
    this.minValue = null;
    this.changes.emit();
  }

  isActive(): boolean {
    return (!!this.minValue && this.minValue !== 0) || !!this.maxValue;
  }

  accepts(): boolean {
    return true;
  }
}
