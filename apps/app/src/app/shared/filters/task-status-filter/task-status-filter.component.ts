import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskStatus } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  selector: 'app-task-status-filter',
  templateUrl: './task-status-filter.component.html',
  styleUrls: ['./task-status-filter.component.scss'],
})
export class TaskStatusFilterComponent
  implements ClrDatagridFilterInterface<TaskStatus>
{
  @Input() name = '';
  @Input() selection: string[] = [];

  @Output() changes = new EventEmitter<boolean>(false);

  // Keep only ids
  taskStatus = TaskStatus;

  status = [
    ...Object.keys(TaskStatus)
      .filter((key) => !Number.isInteger(parseInt(key)))
      .map((key) => ({
        value: TaskStatus[key as keyof typeof TaskStatus],
        label: key,
      })),
  ];

  /**
   * Update filter
   *
   * @param selection
   *
   * @returns void
   */
  onSelectionChange(item: string[]): void {
    this.selection = item;
    this.changes.emit(true);
  }

  @Input()
  set value(value: string | string[]) {
    if (!value) {
      this.selection = [];
      return;
    }

    if (Array.isArray(value)) {
      this.selection = value;
    } else {
      this.selection = [value];
    }
  }

  get value(): string[] {
    return this.selection;
  }

  get property() {
    return this.name;
  }

  /**
   * Check if item is selected.
   *
   * @param item item to check
   */
  isSelected(item: string): boolean {
    return !!this.selection?.includes(item);
    // return this.selectedValue === Number(item);
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
    return !!this.selection?.length;
  }
}
