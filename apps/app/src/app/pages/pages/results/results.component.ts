import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormattedResult, Pagination } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subscription } from 'rxjs';
import {
  AppError,
  BrowserTitleService,
  LanguageService,
  PagerService,
} from '../../../core';
import { ResultsService } from '../../../core/services/http/results.service';
import { StatesService } from '../../../shared';

@Component({
  selector: 'app-pages-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnDestroy {
  errors: AppError[] = [];

  results: Pagination<FormattedResult> | null = null;
  resultsSubscription: Subscription | null = null;
  resultsLoading = false;
  resultsStateKey = 'results-list';
  resultsState: ClrDatagridStateInterface = {};

  constructor(
    private languageService: LanguageService,
    private browserTitleService: BrowserTitleService,
    private resultsService: ResultsService,
    private statesService: StatesService,
    private pagerService: PagerService,
    private cdr: ChangeDetectorRef
  ) {}

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

    const params = this.pagerService.createHttpParams(state);

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
