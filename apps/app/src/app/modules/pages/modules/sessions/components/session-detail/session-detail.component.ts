import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  SessionsService,
  TasksService,
  TitleService,
  Session,
  Task,
  AppError,
} from '../../../../../core/';

@Component({
  selector: 'app-pages-sessions-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss'],
})
export class SessionDetailComponent implements OnInit {
  session: Session | null = null;
  tasks: Pagination<Task> | null = null;
  errors: AppError[] = [];
  loadingSession = true;
  loadingTasks = true;

  constructor(
    private route: ActivatedRoute,
    private titleService: TitleService,
    private translateService: TranslateService,
    private sessionsService: SessionsService,
    private tasksService: TasksService
  ) {
    this.titleService.setTitle(
      this.translateService.instant('sessions.session-detail.title')
    );
  }

  ngOnInit() {
    this.sessionsService.getOne(this.sessionId).subscribe({
      error: this.onErrorSession.bind(this),
      next: this.onNextSession.bind(this),
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
   * Handle the error when getting the session
   *
   * @param error Error
   */
  private onErrorSession(error: AppError) {
    this.errors.push(error);
    this.loadingSession = false;
  }

  /**
   * Handle the session when getting it
   *
   * @param session Session
   */
  private onNextSession(session: Session) {
    this.session = session;
    this.loadingSession = false;
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
  get appName(): string {
    return this.route.snapshot.paramMap.get('application') ?? '';
  }
}
