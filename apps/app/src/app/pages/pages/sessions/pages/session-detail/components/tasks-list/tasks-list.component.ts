import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ErrorStatus,
  Pagination,
  PendingStatus,
  TaskStatus,
} from '@armonik.admin.gui/armonik-typing';
import {
  ClrDatagridSortOrder,
  ClrDatagridStateInterface,
  ClrLoadingState,
} from '@clr/angular';
import { LanguageService, Task } from '../../../../../../../core';
import { StatesService } from '../../../../../../../shared';

@Component({
  selector: 'app-pages-sessions-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent {
  @Input() isAutoRefreshEnabled: boolean | null = null;
  @Output() autoRefreshChange: EventEmitter<void> = new EventEmitter();

  @Input() autoRefreshTimer: number | null = null;
  @Output() autoRefreshTimerChange = new EventEmitter<number>();

  @Input() stateKey = 'tasks';
  @Input() tasks: Pagination<Task> | null = null;
  @Input() loading = true;

  @Input() selection: Task[] = [];
  @Output() selectionChange = new EventEmitter<Task[]>();

  @Input() cancelButtonState = ClrLoadingState.DEFAULT;
  @Output() cancelTasksChange = new EventEmitter<Task[]>();

  @Output() refresh = new EventEmitter<ClrDatagridStateInterface>();
  @Output() manualRefresh = new EventEmitter<void>();

  isModalOpen = false;
  activeTask: Task | null = null;

  @Input() isSeqUp = false;
  @Output() clickSeqLink = new EventEmitter<string>();

  constructor(
    private statesService: StatesService,
    private languageService: LanguageService
  ) {}

  /**
   * Get currant page
   *
   * @returns current page
   */
  get currentPage(): number {
    return this.statesService.getCurrentPage(this.stateKey);
  }

  /**
   * Get page size
   *
   * @returns page size
   */
  get pageSize(): number {
    return this.statesService.getPageSize(this.stateKey);
  }

  /**
   * Get filter value from the filters store
   *
   * @param key Key to find the filter value
   *
   * @returns filter value
   */
  getFilterValue(key: string): string {
    return this.statesService.getFilterValue(this.stateKey, key);
  }

  /**
   * Get sort order from the filters store
   *
   * @param key Key to find the sort order
   *
   * @returns sort order
   */
  getSortOrder(key: string): ClrDatagridSortOrder {
    return this.statesService.getSortOrder(this.stateKey, key);
  }

  /**
   * Emit event when click on seq link
   *
   * @param taskId Task id
   */
  onClickSeqLink(event: Event, taskId: string) {
    event.preventDefault();
    this.clickSeqLink.emit(taskId);
  }

  /**
   * Emit event when auto refresh change
   */
  onAutoRefreshChange() {
    this.autoRefreshChange.emit();
  }

  /**
   * Emit event when auto refresh timer change
   *
   * @param timer New timer value
   */
  onAutoRefreshTimerChange(timer: number) {
    this.autoRefreshTimerChange.emit(timer);
  }

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
   * Calculate duration between start and end date
   *
   * @param start Start date
   * @param end End date
   *
   * @returns Duration between start and end date
   */
  duration(
    start: Date,
    end: Date
  ): { days: number; hours: number; minutes: number; seconds: number } {
    const diff = end.getTime() - start.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  /**
   * Print time
   *
   * @param date
   *
   * @returns Time string
   */
  printTime(date: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }): string {
    const time = [];
    if (date.days > 0) {
      time.push(
        this.languageService.instant(
          'pages.sessions.session-detail.table.duration.days',
          {
            value: date.days.toString(),
          }
        )
      );
    }
    if (date.hours > 0) {
      time.push(
        this.languageService.instant(
          'pages.sessions.session-detail.table.duration.hours',
          {
            value: date.hours.toString(),
          }
        )
      );
    }
    if (date.minutes > 0) {
      time.push(
        this.languageService.instant(
          'pages.sessions.session-detail.table.duration.minutes',
          {
            value: date.minutes.toString(),
          }
        )
      );
    }
    if (date.seconds > 0) {
      time.push(
        this.languageService.instant(
          'pages.sessions.session-detail.table.duration.seconds',
          {
            value: date.seconds.toString(),
          }
        )
      );
    }
    return time.join(' ');
  }

  /**
   * Convert string to date
   *
   * @param date String to convert
   *
   * @returns Date
   */
  toDate(date: string): Date {
    return new Date(date);
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
   * Used to track error for ngFor
   *
   * @param index Index of the error
   * @param error Error to track
   *
   * @returns Task id
   */
  trackByTask(_: number, task: Task) {
    return task._id;
  }
}
