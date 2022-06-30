import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ErrorStatus,
  Pagination,
  PendingStatus,
  TaskStatus,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface, ClrLoadingState } from '@clr/angular';
import { Task } from '../../../../../../../core';

@Component({
  selector: 'app-pages-sessions-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent {
  @Input() tasks: Pagination<Task> | null = null;
  @Input() selection: Task[] = [];
  @Input() loading = true;
  @Input() cancelButtonState = ClrLoadingState.DEFAULT;

  @Output() refresh = new EventEmitter<ClrDatagridStateInterface>();
  @Output() manualRefresh = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<Task[]>();
  @Output() cancelTasksChange = new EventEmitter<Task[]>();

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
  trackByTask(index: number, task: Task) {
    return task?._id ?? index;
  }

  /**
   * Used to check if task status is in error
   *
   * @param task Task to check
   */
  isError(task: Task): boolean {
    return ErrorStatus.includes(task.status);
  }

  /**
   * Used to check if task status is in pending
   *
   * @param task Task to check
   */
  isPending(task: Task): boolean {
    return PendingStatus.includes(task.status);
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
   * Used to check if task status is cancelling
   *
   * @param task Task to check
   *
   * @returns true if task is cancelling
   */
  isCancelling(task: Task): boolean {
    return task.status === TaskStatus.CANCELLING;
  }

  /**
   * Used to check if task status is in cancelled
   *
   * @param task Task to check
   */
  isCancelled(task: Task): boolean {
    return task.status === TaskStatus.CANCELLED;
  }

  /**
   * Used to check if task status is in processing
   *
   * @param task Task to check
   */
  isProcessing(task: Task): boolean {
    return task.status === TaskStatus.PROCESSING;
  }

  /**
   * Used to track task for ngFor
   *
   * @param index Index of the task
   * @param task Task to track
   *
   * @returns Task id
   */
  trackByTaskId(_: number, task: Task) {
    return task._id;
  }
}
