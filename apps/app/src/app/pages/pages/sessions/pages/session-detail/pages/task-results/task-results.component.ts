import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormattedResult, Pagination } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  AppError,
  BrowserTitleService,
  LanguageService,
  PagerService,
  ResultsService,
} from '../../../../../../../core';
import { StatesService } from '../../../../../../../shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pages-sessions-task-results',
  templateUrl: './task-results.component.html',
  styleUrls: ['./task-results.component.scss'],
})
export class TaskResultsComponent implements OnInit, OnDestroy {
  errors: AppError[] = [];

  results: Pagination<FormattedResult> | null = null;
  resultsSubscription: Subscription | null = null;
  resultsLoading = false;
  resultsState: ClrDatagridStateInterface = {};

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private browserTitleService: BrowserTitleService,
    private resultsService: ResultsService,
    private statesService: StatesService,
    private pagerService: PagerService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Return the current task id form the route
   *
   * @returns Id for the task
   */
  get taskId(): string {
    return this.route.snapshot.paramMap.get('task') ?? '';
  }

  get resultsStateKey(): string {
    return `results-list-${this.taskId}`;
  }

  ngOnInit() {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.results.title')
    );
  }

  ngOnDestroy() {
    this.resultsSubscription?.unsubscribe();
  }

  /**
   * Used to get the list of results from the api using pagination and filters for the datagrid and refresh the datagrid
   *
   * @param state Clarity datagrid state
   */
  onRefreshResults(state: ClrDatagridStateInterface): void {
    this.resultsLoading = true;

    // Stop current request to avoid multiple requests at the same time
    this.resultsSubscription?.unsubscribe();

    // Store the current state to be saved when the request completes
    this.resultsState = state;

    const params = this.pagerService.createHttpParams(state, {
      OwnerTaskId: this.taskId,
    });

    this.resultsSubscription = this.resultsService
      .getAllPaginated(params)
      .subscribe({
        next: this.onNextResults.bind(this),
        error: this.onErrorResults.bind(this),
      });
    // Refresh the datagrid
    this.cdr.detectChanges();
  }

  /**
   * Handle the error when getting the results
   *
   * @param error
   */
  private onErrorResults(error: AppError): void {
    this.resultsLoading = false;
    this.errors.push(error);
  }

  /**
   * Handle the results
   *
   * @param results
   */
  private onNextResults(results: Pagination<FormattedResult>): void {
    this.statesService.saveState(this.resultsStateKey, this.resultsState);
    this.resultsLoading = false;
    this.results = results;
  }
}
