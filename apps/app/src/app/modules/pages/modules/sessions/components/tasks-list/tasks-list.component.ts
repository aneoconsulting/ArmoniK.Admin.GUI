import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface, ClrLoadingState } from '@clr/angular';
import { Task, TasksService } from '../../../../../core/';

@Component({
  selector: 'app-pages-sessions-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent {
  @Input() tasks: Pagination<Task> | null = null;
  @Input() loading = true;

  @Output() refresh = new EventEmitter<ClrDatagridStateInterface>();

  selected: Task[] = [];
  cancelButtonState = ClrLoadingState.DEFAULT;

  constructor(private tasksService: TasksService) {}

  /**
   * Used to cancel tasks (one or many)
   */
  cancel() {
    const ids = this.selected.map((task) => task._id);
    if (ids.length > 0) {
      this.cancelButtonState = ClrLoadingState.LOADING;
      // TODO: handle error connexion with the api (and show a banner using the core component)
      this.tasksService.cancelMany(ids).subscribe({
        complete: () => {
          this.cancelButtonState = ClrLoadingState.SUCCESS;
          this.selected = [];
        },
      });
    }
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
}
