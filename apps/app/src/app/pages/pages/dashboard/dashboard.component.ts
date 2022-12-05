import { HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Application,
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import {
  AppError,
  ApplicationsService,
  BrowserTitleService,
  GrpcApplicationsService,
  LanguageService,
  PagerService,
  SettingsService,
} from '../../../core';
import {
  ApplicationRaw,
  ListApplicationsResponse,
} from '../../../core/types/proto/applications-common.pb';
import { StatesService } from '../../../shared';

/**
 *  Display the dashboard
 */
@Component({
  selector: 'app-pages-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  page = 0;
  pageSize = 9;
  total = 0;

  private _subjectManual = new Subject<void>();
  private _triggerManual$ = this._subjectManual.asObservable();

  loadingApplications$ = new BehaviorSubject<boolean>(true);
  applications$ = this._triggerManual$.pipe(
    tap(() => this.loadingApplications$.next(true)),
    switchMap(() => this._listApplications$())
  );

  // past
  applicationsErrorsSubscription = new Subscription();
  subscriptions: Subscription = new Subscription();

  applications: Application[] = [];

  errors: AppError[] = [];

  applicationsErrorsStateKey = 'applications-errors';
  private state: ClrDatagridStateInterface = {};
  applicationsErrorsLoading = true;
  applicationsErrors: Pagination<ApplicationError> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private browserTitleService: BrowserTitleService,
    public settingsService: SettingsService,
    private statesService: StatesService,
    private pagerService: PagerService,
    private applicationsService: ApplicationsService,
    private cdr: ChangeDetectorRef,
    private _grpcApplicationsService: GrpcApplicationsService
  ) {}

  ngOnInit() {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.dashboard.title')
    );

    this.subscriptions.add(
      this.route.data.subscribe((data) => {
        if (data['applications']) {
          this.applications = data['applications'];
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this._subjectManual.next();
  }

  ngOnDestroy(): void {
    this.applicationsErrorsSubscription.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  manualRefreshApplications(): void {
    this._subjectManual.next();
  }

  nextPage(): void {
    this.page += 1;
    this._subjectManual.next();
  }

  previousPage(): void {
    this.page -= 1;
    this._subjectManual.next();
  }

  get isFirstPage(): boolean {
    return this.page === 0;
  }

  get isLastPage(): boolean {
    return this.page === this.lastPage;
  }

  get lastPage(): number {
    return Math.ceil(this.total / this.pageSize) - 1;
  }

  get hasApplications(): boolean {
    return !!this.total;
  }

  /**
   * Redirect to Seq
   *
   * @param taskId Task ID
   *
   * @returns URL
   */
  redirectToSeq(taskId: string) {
    window.open(
      this.settingsService.generateSeqUrlForTaskError(taskId),
      '_blank'
    );
  }

  /**
   * Used to get the list of application errors from the api
   * using pagination for the datagrid and refresh the datagrid
   *
   * @param state Clarity datagrid state
   */
  onRefreshApplicationsErrors(state: ClrDatagridStateInterface) {
    this.applicationsErrorsLoading = true;

    // Stop current request to avoid multiple requests at the same time
    this.applicationsErrorsSubscription.unsubscribe();

    // Store the current state to be saved when the request completes
    this.state = state;

    const params = this.pagerService.createHttpParams(state);

    this.applicationsErrorsSubscription = this.applicationsService
      .getAllWithErrorsPaginated(params)
      .subscribe({
        error: this.onErrorApplicationsErrors.bind(this),
        next: this.onNextApplicationsErrors.bind(this),
      });
    // Refresh the datagrid
    this.cdr.detectChanges();
  }

  /**
   * Update application on application click
   *
   * @param applicationId
   */
  onApplicationClick(application: Application) {
    this.settingsService.addCurrentApplication(application);

    this.router.navigate([
      '/',
      'applications',
      application._id.applicationName,
      application._id.applicationVersion,
      'sessions',
    ]);
  }

  /**
   * Used to track application for ngFor
   *
   * @param index
   * @param application
   *
   * @returns value
   */
  trackByApplication(_: number, application: ApplicationRaw): string {
    return application.name + application.version;
  }

  /**
   * Handle the error when getting applications
   *
   * @param error Error
   */
  private onErrorApplicationsErrors(error: AppError) {
    this.applicationsErrorsLoading = false;
    this.errors.push(error);
  }

  /**
   * Handle applications when getting them
   *
   * @param applications Applications
   */
  private onNextApplicationsErrors(applications: Pagination<ApplicationError>) {
    this.statesService.saveState(this.applicationsErrorsStateKey, this.state);
    this.applicationsErrorsLoading = false;
    this.applicationsErrors = applications;
  }

  private _listApplications$(): Observable<ListApplicationsResponse> {
    const httpParams = new HttpParams({
      fromObject: {
        page: this.page,
        pageSize: this.pageSize,
      },
    });
    return this._grpcApplicationsService.list$(httpParams).pipe(
      catchError((error: Error) => {
        console.error(error);

        return of({} as ListApplicationsResponse);
      }),
      tap((applications) => {
        this.total = applications.total ?? 0;
      }),
      tap(() => this.loadingApplications$.next(false))
    );
  }
}
