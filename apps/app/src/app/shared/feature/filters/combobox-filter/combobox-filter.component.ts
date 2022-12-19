import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStatus } from '@armonik.admin.gui/shared/data-access';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-combobox-filter',
  templateUrl: './combobox-filter.component.html',
  styleUrls: ['./combobox-filter.component.scss'],
  imports: [ClarityModule, FormsModule, TranslateModule, CommonModule],
})
export class ComboBoxFilterComponent
  implements ClrDatagridFilterInterface<TaskStatus>
{
  @Input() name = '';
  @Input() selectedValues: number[] = [];
  @Input() selectionList: { value: number; label: string }[] = [];
  @Output() changes = new EventEmitter<never>();

  get value(): number[] {
    return this.selectedValues;
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
    return this.selectedValues.length !== 0;
  }
}
