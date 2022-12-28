import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrpcPagerService } from '@armonik.admin.gui/shared/data-access';
import { DisabledIntervalValue } from '@armonik.admin.gui/shared/feature';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  concatMap,
  merge,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import {
  BrowserTitleService,
  LanguageService,
  SettingsService,
} from '../../../shared/util';

@Component({
  selector: 'app-partitions-list',
  templateUrl: './partitions-list.page.html',
  styleUrls: ['./partitions-list.page.scss'],
})
export class PartitionsListComponent implements OnInit {
  private _state: ClrDatagridStateInterface = {};

  /** Get partitions */
  private _subjectManual = new Subject<void>();
  private _subjectDatagrid = new Subject<ClrDatagridStateInterface>();
  private _intervalValue = new Subject<number>();
  private _stopInterval = new Subject<void>();
  public stopInterval$ = this._stopInterval.asObservable();

  /** Triggers to reload partitions */
  private _triggerManual$: Observable<void> =
    this._subjectManual.asObservable();
  private _triggerDatagrid$: Observable<ClrDatagridStateInterface> =
    this._subjectDatagrid.asObservable().pipe(
      tap((state) => this._saveState(state)),
      concatMap(async (state) => {
        const params = this._grpcPagerService.createParams(state);
        await this._router.navigate([], {
          queryParams: params,
          relativeTo: this._activatedRoute,
        });
        return state;
      })
    );
  private _triggerInterval$: Observable<number> = this._intervalValue
    .asObservable()
    .pipe(
      switchMap((time) => timer(0, time).pipe(takeUntil(this.stopInterval$)))
    );

  loadingPartitions$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  totalPartitions$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  loadPartitions$ = merge(
    this._triggerManual$,
    this._triggerDatagrid$,
    this._triggerInterval$
  ).pipe(
    tap(() => this.loadingPartitions$.next(true)),
    switchMap(() => this._listPartitions$())
  );

  filterPartitionId$: Observable<string> =
    this._settingsService.queryStringParam$(
      this._activatedRoute.queryParamMap,
      'id'
    );
  filterParentId$: Observable<string> = this._settingsService.queryStringParam$(
    this._activatedRoute.queryParamMap,
    'parentId'
  );

  page$: Observable<number> = this._settingsService.queryParam$(
    this._activatedRoute.queryParamMap,
    'page'
  );
  pageSize$: Observable<number> = this._settingsService.queryParam$(
    this._activatedRoute.queryParamMap,
    'pageSize'
  );

  constructor(
    private _settingsService: SettingsService,
    private _languageService: LanguageService,
    private _browserTitleService: BrowserTitleService,
    private _grpcPagerService: GrpcPagerService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._browserTitleService.setTitle(
      this._languageService.instant('pages.partitions-list.title')
    );
  }

  public get OrderByField() {
    return ListPartitionsRequest.OrderByField;
  }

  public get intervals(): number[] {
    return this._settingsService.intervals;
  }

  public get initialInterval(): number {
    return this._settingsService.initialInterval;
  }

  /**
   * Save state
   *
   * @param state
   */
  private _saveState(state: ClrDatagridStateInterface) {
    this._state = state;
  }

  /**
   * Restore state
   *
   * @returns State
   */
  private _restoreState(): ClrDatagridStateInterface {
    return this._state;
  }

  private _listPartitions$() {
    return '';
  }

  public onUpdateInterval(value: number) {
    this._intervalValue.next(value);

    // Stop interval
    if (value === DisabledIntervalValue) {
      this._stopInterval.next();
    }
  }

  /**
   * Refresh partitions using a new state
   *
   * @param state
   *
   * @returns void
   */
  public refreshPartitions(state: ClrDatagridStateInterface): void {
    this._subjectDatagrid.next(state);
  }

  /**
   * Refresh manually partitions without a new state
   *
   * @returns void
   */
  public manualRefreshPartitions(): void {
    this._subjectManual.next();
  }

  /**
   * Track by result
   *
   * @param _
   * @param result
   *
   * @returns Id
   */
  public trackByPartition(_: number, result: PartitionRaw): string {
    return result.name ?? '';
  }

  /**
   * Track by interval
   *
   * @param _
   * @param interval
   *
   * @returns Interval
   */
  public trackByInterval(_: number, interval: number): string {
    return interval.toString();
  }

  public defaultSortOrder(
    field: ListPartitionsRequest.OrderByField
  ): ClrDatagridSortOrder {
    const orderBy = Number(
      this._activatedRoute.snapshot.queryParamMap.get('orderBy')
    );

    if (orderBy !== field) return ClrDatagridSortOrder.UNSORTED;

    const order =
      Number(this._activatedRoute.snapshot.queryParamMap.get('order')) || 1;

    if (order === -1) return ClrDatagridSortOrder.DESC;

    return ClrDatagridSortOrder.ASC;
  }

  /**
   * Checks if the datagrid is ordered by any column
   *
   * @returns true if yes, false if no
   */
  isOrdered(): boolean {
    return !!this._state.sort;
  }

  /**
   * Set the datagrid to the default order
   */
  clearOrder(): void {
    delete this._state.sort;
    this._subjectDatagrid.next(this._state);
  }

  /**
   * Checks if one filter is applied to the datagrid
   *
   * @returns true if yes, false if no
   */
  isFiltered(): boolean {
    return !!this._state.filters;
  }

  /**
   * Clear all filters currently applied to the datagrid
   */
  clearAllFilters() {
    delete this._state.filters;
    this.refreshPartitions(this._state);
  }
}
