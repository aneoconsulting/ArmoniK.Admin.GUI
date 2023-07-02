import {
  GetPartitionResponse,
  ListPartitionsRequest,
  ListPartitionsResponse,
  PartitionRaw,
  PartitionRawField,
} from '@aneoconsultingfr/armonik.api.angular';
import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GrpcPartitionsService } from '@armonik.admin.gui/partitions/data-access';
import { DisabledIntervalValue } from '@armonik.admin.gui/shared/feature';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  concatMap,
  merge,
  of,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { SettingsService } from '../../../shared/util';
import {
  IdFilterComponent,
  NumericFilterComponent,
} from '../../../shared/feature/filters';

@Component({
  selector: 'app-partitions-list',
  templateUrl: './partitions-list.page.html',
  styleUrls: ['./partitions-list.page.scss'],
})
export class PartitionsListComponent {
  private _state: ClrDatagridStateInterface = {};
  private _intervalValue = this._settingsService.intervalQueryParam(
    this._activatedRoute.snapshot.queryParams
  );

  /** Get partitions */
  private _subjectManual = new Subject<void>();
  private _subjectDatagrid = new Subject<ClrDatagridStateInterface>();
  private _stopInterval = new Subject<void>();
  public stopInterval$ = this._stopInterval.asObservable();

  /** Triggers to reload partitions */
  private _triggerManual$: Observable<void> =
    this._subjectManual.asObservable();
  private _triggerDatagrid$: Observable<ClrDatagridStateInterface> =
    this._subjectDatagrid.asObservable().pipe(
      tap((state) => this._saveState(state)),
      concatMap(async (state) => {
        const params =
          this._grpcPartitionsService.createListRequestParams(state);
        const queryParams =
          this._grpcPartitionsService.createListRequestQueryParams(
            params,
            this._intervalValue
          );
        await this._router.navigate([], {
          queryParams,
          relativeTo: this._activatedRoute,
        });
        return state;
      })
    );
  private _triggerInterval$: Observable<number> = timer(
    0,
    this._intervalValue
  ).pipe(takeUntil(this.stopInterval$));

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

  /**
   * Get a single partition.
   * Used for "details" button.
   */

  private _opened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private _subjectSinglePartition: Subject<string> = new Subject<string>();
  private _triggerSinglePartition: Observable<string> =
    this._subjectSinglePartition.asObservable();

  loadingSinglePartition$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  loadSinglePartition$ = this._triggerSinglePartition.pipe(
    tap((partitionId) => this.loadingSinglePartition$.next(partitionId)),
    switchMap((partitionId) => this._getPartition$(partitionId))
  );

  filterPartitionId: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'id'
  );
  filterParentId: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParamMap,
    'parentPartitionIds'
  );
  filterPodReserved: number | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'podReserved'
  );
  filterPodMax: number | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'podMax'
  );
  filterPreemption: number | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'preemptionPercentage'
  );
  filterPriority: number | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'priority'
  );

  constructor(
    private _settingsService: SettingsService,
    private _activatedRoute: ActivatedRoute,
    private _grpcPartitionsService: GrpcPartitionsService,
    private _router: Router
  ) {}

  public get refreshIntervalValue() {
    return this._intervalValue;
  }

  public get page$(): Observable<number> {
    return this._settingsService.queryParam$(
      this._activatedRoute.queryParamMap,
      'page'
    );
  }

  public get pageSize$(): Observable<number> {
    return this._settingsService.queryParam$(
      this._activatedRoute.queryParamMap,
      'pageSize'
    );
  }

  public get OrderByField() {
    return PartitionRawField;
  }

  public get intervals(): number[] {
    return this._settingsService.intervals;
  }

  public get initialInterval(): number {
    return this._settingsService.initialInterval;
  }

  public onUpdateInterval(value: number) {
    if (value === DisabledIntervalValue) {
      this._stopInterval.next();
    }
    this._intervalValue = value;
    this._subjectDatagrid.next(this._state);
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
   * Track by partition
   *
   * @param _
   * @param partition
   *
   * @returns Id
   */
  public trackByPartition(_: number, partition: PartitionRaw): string {
    return partition.id ?? '';
  }

  public defaultSortOrder(field: PartitionRawField): ClrDatagridSortOrder {
    const orderBy = Number(
      this._activatedRoute.snapshot.queryParamMap.get('orderBy')
    );

    if (orderBy !== field) return ClrDatagridSortOrder.UNSORTED;

    const order =
      Number(this._activatedRoute.snapshot.queryParamMap.get('order')) || 1;

    if (order === -1) return ClrDatagridSortOrder.DESC;

    return ClrDatagridSortOrder.ASC;
  }

  public mergeWithCurrentQueryParams(newQueryParams: Params): Params {
    return { ...this._activatedRoute.snapshot.queryParams, ...newQueryParams };
  }

  private _listPartitions$(): Observable<ListPartitionsResponse> {
    const state = this._restoreState();
    const params = this._grpcPartitionsService.createListRequestParams(state);
    const grpcParams =
      this._grpcPartitionsService.createListRequestOptions(params);
    return this._grpcPartitionsService.list$(grpcParams).pipe(
      catchError((error) => {
        console.log(error);
        this._stopInterval.next();

        return of({} as ListPartitionsResponse);
      }),
      tap((partitions) => {
        this.loadingPartitions$.next(false);
        this.totalPartitions$.next(partitions.total ?? 0);
      })
    );
  }

  private _getPartition$(id: string): Observable<GetPartitionResponse> {
    return this._grpcPartitionsService.get$(id).pipe(
      catchError((error) => {
        console.log(error);

        return of({} as GetPartitionResponse);
      }),
      tap(() => {
        this.openGetPartitionModal(), this.loadingSinglePartition$.next(null);
      })
    );
  }

  public viewPartitionDetail(partitionId: string): void {
    this._subjectSinglePartition.next(partitionId);
  }

  /**
   * Open modal to view details
   */
  public openGetPartitionModal(): void {
    this._opened$.next(true);
  }

  /**
   * Close modal to view details
   */
  public closeGetPartitionModal(): void {
    this._opened$.next(false);
  }

  public get isGetPartitionModalOpened$(): Observable<boolean> {
    return this._opened$.asObservable();
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
   * Set a new filter value via clicking a link in the datagrid.
   *
   * @param filter the filter to change.
   * @param value the new filter value.
   */
  setFilterViaGridLink(
    filter: NumericFilterComponent | IdFilterComponent,
    value: number | string
  ) {
    filter.selectedValue = value;
    filter.changes.emit();
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
    this._state.filters?.forEach((filter) => {
      filter.reset();
    });
    delete this._state.filters;
    this.refreshPartitions(this._state);
  }
}
