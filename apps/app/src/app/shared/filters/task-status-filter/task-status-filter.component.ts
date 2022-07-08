import { Component, EventEmitter, Input } from '@angular/core';
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
  public property = this.name;

  // Keep only ids
  taskStatus = TaskStatus;
  status = Object.keys(TaskStatus).filter(
    (x) => parseInt(x) >= 0
  ) as unknown as number[];
  selectedValue: TaskStatus | null = null;
  changes = new EventEmitter<boolean>(false);

  onChange(event: any) {
    this.selectedValue = event.target.value;
    this.changes.emit(true);
  }

  get value() {
    return this.selectedValue;
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
    return !!this.selectedValue;
  }
}
