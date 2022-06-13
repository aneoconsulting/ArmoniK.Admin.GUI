import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
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
  @Output() selectionChange = new EventEmitter<Task[]>();
  @Output() cancelTasksChange = new EventEmitter<Task[]>();

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
}
