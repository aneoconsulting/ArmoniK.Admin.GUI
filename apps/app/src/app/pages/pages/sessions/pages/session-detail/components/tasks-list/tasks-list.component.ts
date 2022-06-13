import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ErrorStatus,
  Pagination,
  PendingStatus,
  TaskStatus,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import { LanguageService, Task } from '../../../../../../../core';

@Component({
  selector: 'app-pages-sessions-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent {
  @Input() tasks: Pagination<Task> | null = null;
  @Input() loading = true;

  @Output() refresh = new EventEmitter<ClrDatagridStateInterface>();

  isModalOpen = false;
  activeTask: Task | null = null;

  openModal(task: Task) {
    this.activeTask = task;
    this.isModalOpen = true;
  }

  /**
   * Return total number of tasks event if there is no task (return 0)
   */
  get totalTasks(): number {
    return this.tasks ? this.tasks.meta.total : 0;
  }

  /**
   * Used to track error for ngFor
   */
  trackByTask(_: number, task: Task) {
    return task._id;
  }

  /**
   * Used to check if task status is in error
   *
   * @param task Task to check
   */
  isError(task: Task): boolean {
    return task.status in ErrorStatus;
  }

  /**
   * Used to check if task status is in pending
   *
   * @param task Task to check
   */
  isPending(task: Task): boolean {
    return task.status in PendingStatus;
  }

  /**
   * Used to check if task status is in completed
   *
   * @param task Task to check
   */
  isCompleted(task: Task): boolean {
    return task.status === TaskStatus.COMPLETED;
  }

  /**
   * Used to check if task status is in cancelled
   *
   * @param task Task to check
   */
  isCancelled(task: Task): boolean {
    return task.status === TaskStatus.CANCELED;
  }

  /**
   * Used to check if task status is in processing
   *
   * @param task Task to check
   */
  isProcessing(task: Task): boolean {
    return task.status === TaskStatus.PROCESSING;
  }
}
