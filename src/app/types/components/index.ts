import { inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { FiltersEnums } from '@app/dashboard/types';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableColumn } from '../column.type';
import { IndexListOptions, RawColumnKey } from '../data';
import { RawFilters } from '../filters';
import { Page } from '../pages';
import { FiltersServiceInterface } from '../services/filtersService';
import { IndexServiceInterface } from '../services/indexService';

export abstract class TableHandler<K extends RawColumnKey, O extends IndexListOptions, F extends RawFilters, E extends FiltersEnums> {
  readonly shareUrlService = inject(ShareUrlService);
  readonly iconsService = inject(IconsService);
  readonly autoRefreshService = inject(AutoRefreshService);

  abstract readonly indexService: IndexServiceInterface<K, O>;
  abstract readonly filtersService: FiltersServiceInterface<F, E>;

  displayedColumns: TableColumn<K>[] = [];
  displayedColumnsKeys: K[] = [];
  availableColumns: K[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<K, string> = {} as Record<K, string>;

  isLoading = true;
  isLoading$: Subject<boolean> = new BehaviorSubject<boolean>(true);

  options: O;

  filters: F;
  filters$: Subject<F>;

  intervalValue = 0;
  sharableURL = '';

  refresh$: Subject<void> = new Subject<void>();
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.autoRefreshService.createInterval(this.interval, this.stopInterval);

  subscriptions: Subscription = new Subscription();

  initTableEnvironment() {
    this.initColumns();
    this.initFilters();
    this.initOptions();
    this.intervalValue = this.indexService.restoreIntervalValue();
    this.sharableURL = this.shareUrlService.generateSharableURL(this.options, this.filters);
  }

  private initColumns() {
    this.displayedColumnsKeys = this.indexService.restoreColumns();
    this.updateDisplayedColumns();
    this.availableColumns = this.indexService.availableTableColumns.map(column => column.key);
    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this.indexService.restoreLockColumns();
  }

  private initFilters() {
    this.filters = this.filtersService.restoreFilters();
    this.filters$ = new BehaviorSubject(this.filters);
  }

  private initOptions() {
    this.options = this.indexService.restoreOptions();
  }

  mergeSubscriptions() {
    const mergeSubscription = merge(this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    const loadingSubscription = this.isLoading$.subscribe(isLoading => this.isLoading = isLoading);
    this.subscriptions.add(mergeSubscription);
    this.subscriptions.add(loadingSubscription);
  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.displayedColumnsKeys.map(key => this.indexService.availableTableColumns.find(column => column.key === key) as TableColumn<K>);
  }

  getPageIcon(name: Page): string {
    return this.iconsService.getPageIcon(name);
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
    this.intervalValue = value;

    if (value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this.indexService.saveIntervalValue(value);
  }

  onColumnsChange(data: K[]) {
    this.displayedColumnsKeys = [...data];
    this.updateDisplayedColumns();
    this.indexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this.indexService.resetColumns();
    this.updateDisplayedColumns();
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as F;

    this.filtersService.saveFilters(value as F);
    this.options.pageIndex = 0;
    this.filters$.next(this.filters);
  }

  onFiltersReset(): void {
    this.filters = this.filtersService.resetFilters();
    this.options.pageIndex = 0;
    this.filters$.next([] as unknown as F);
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this.indexService.saveLockColumns(this.lockColumns);
  }

  autoRefreshTooltip() {
    return this.autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }
}