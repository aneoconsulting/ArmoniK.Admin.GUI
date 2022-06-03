import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  TasksService,
  Session,
  Task,
  AppError,
  BrowserTitleService,
  LanguageService,
} from '../../../../../core';

@Component({
  selector: 'app-pages-sessions-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss'],
})
export class SessionDetailComponent implements OnInit {
  session: Session | undefined;
  tasks: Pagination<Task> | null = null;
  errors: AppError[] = [];
  loadingTasks = true;

  constructor(
    private route: ActivatedRoute,
    private browserTitleService: BrowserTitleService,
    private languageService: LanguageService,
    private tasksService: TasksService
  ) {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.sessions.session-detail.title')
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      if (data['session']) {
        this.session = data['session'];
      }
    });
  }

  /**
   * Used to get the list of tasks from the api using pagination for the datagrid and refresh the datagrid
   *
   * @param state Clarity datagrid state
   */
  refresh(state: ClrDatagridStateInterface) {
    const nextPage = state?.page?.current ?? 1;
    const limit = state?.page?.size ?? 10;

    this.tasksService
      .getAllPaginated(this.sessionId, nextPage, limit)
      .subscribe({
        error: this.onErrorTasks.bind(this),
        next: this.onNextTasks.bind(this),
      });
  }

  /**
   * Handle the error when getting tasks
   *
   * @param error Error
   */
  private onErrorTasks(error: AppError) {
    this.errors.push(error);
    this.loadingTasks = false;
  }

  /**
   * Handle tasks when getting them
   *
   * @param tasks Tasks
   */
  private onNextTasks(tasks: Pagination<Task>) {
    this.tasks = tasks;
    this.loadingTasks = false;
  }

  /**
   * Return the current session id from the route
   *
   * @returns Id of the session
   */
  get sessionId(): string {
    return this.route.snapshot.paramMap.get('session') ?? '';
  }

  /**
   * Return the current application name from the route
   *
   * @returns Name of the application
   */
  get applicationName(): string {
    return this.route.snapshot.paramMap.get('application') ?? '';
  }
}
