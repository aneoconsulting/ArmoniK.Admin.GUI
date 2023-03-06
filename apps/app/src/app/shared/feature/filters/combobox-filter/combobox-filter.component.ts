import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  standalone: true,
  selector: 'app-combobox-filter',
  templateUrl: './combobox-filter.component.html',
  styleUrls: ['./combobox-filter.component.scss'],
  imports: [ClarityModule, FormsModule, CommonModule],
})
export class ComboBoxFilterComponent
  implements ClrDatagridFilterInterface<TaskStatus>, OnDestroy
{
  @Input() name = '';
  @Input() selectedValues: number[] | null = [];
  @Input() selectionList: { value: number; label: string }[] = [];
  @Output() changes = new EventEmitter<never>();

  ngOnDestroy(): void {
    this.selectedValues = null;
  }

  get value(): number[] {
    return this.selectedValues ?? [];
  }

  get property() {
    return this.name;
  }

  /**
   * Update filter
   *
   * @returns void
   */
  onSelectionChange(): void {
    this.changes.emit();
  }

  clear(): void {
    this.selectedValues = [];
    this.changes.emit();
  }

  reset(): void {
    this.selectedValues = [];
  }

  /**
   * Unused but required by the interface.
   */
  accepts() {
    return true;
  }

  /**
   * Verify if the filter is active.
   */
  isActive(): boolean {
    return !!this.selectedValues && this.selectedValues.length !== 0;
  }
}
