import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AppError,
  Task,
  TasksService,
  TitleService,
} from '../../../../../core';

@Component({
  selector: 'app-pages-sessions-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  task: Task | null = null;
  errors: AppError[] = [];
  loadingTask = true;

  constructor(
    private route: ActivatedRoute,
    private titleService: TitleService,
    private translateService: TranslateService,
    private tasksService: TasksService
  ) {
    this.titleService.setTitle(this.translateService.instant('tasks.title'));
  }

  ngOnInit() {
    this.tasksService.getOne(this.taskId).subscribe({
      error: this.onErrorTask.bind(this),
      next: this.onNextTask.bind(this),
    });
  }

  /**
   * Handle error for task
   *
   * @param error Error
   */
  private onErrorTask(error: AppError) {
    this.errors.push(error);
    this.loadingTask = false;
  }

  /**
   * Handle next task
   *
   * @param task Task
   */
  private onNextTask(task: Task) {
    this.task = task;
    this.loadingTask = false;
  }

  /**
   * Return the current task id from the route
   *
   * @returns Id for the task
   */
  get taskId(): string {
    return this.route.snapshot.paramMap.get('task') ?? '';
  }

  /**
   * Return the current session id from the route
   *
   * @returns Id for the session
   */
  get sessionId(): string {
    return this.route.snapshot.paramMap.get('session') ?? '';
  }

  /**
   * Return the current application name from the route
   *
   * @returns Name for the application
   */
  get appName(): string {
    return this.route.snapshot.paramMap.get('application') ?? '';
  }
}
