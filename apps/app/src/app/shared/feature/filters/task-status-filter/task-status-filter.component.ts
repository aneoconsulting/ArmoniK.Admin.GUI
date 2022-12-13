import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStatus } from '@armonik.admin.gui/shared/data-access';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-task-status-filter',
  templateUrl: './task-status-filter.component.html',
  styleUrls: ['./task-status-filter.component.scss'],
  imports: [ClarityModule, FormsModule, TranslateModule, CommonModule],
})
export class TaskStatusFilterComponent
  implements ClrDatagridFilterInterface<TaskStatus>, OnInit
{
  @Input() name = '';
  @Input() selectedValues: number[] = [];
  @Output() changes = new EventEmitter<never>();

  // Keep only ids
  taskStatus = TaskStatus;
  status: { value: TaskStatus; label: string }[];

  get value(): number[] {
    return this.selectedValues;
  }

  get property() {
    return this.name;
  }

  ngOnInit(): void {
    this.status = [
      ...Object.keys(TaskStatus)
        .filter((key) => !Number.isInteger(parseInt(key)))
        .map((key) => ({
          value: TaskStatus[key as keyof typeof TaskStatus],
          label: key,
        })),
    ];
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
