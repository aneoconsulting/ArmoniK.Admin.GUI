import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';

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
  @Input() selectedValue: number | null = null;

  @Output() changes = new EventEmitter<never>();

  get property(): string {
    return this.name;
  }

  get value(): number | null {
    return this.selectedValue;
  }

  onChange() {
    this.changes.emit();
  }

  clear() {
    this.selectedValue = null;
    this.changes.emit();
  }

  reset() {
    this.selectedValue = null;
  }

  isActive(): boolean {
    return !!this.selectedValue && this.selectedValue !== 0;
  }

  accepts(): boolean {
    return true;
  }
}
