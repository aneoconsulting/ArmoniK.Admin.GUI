import { inject } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { FiltersEnums } from '@app/dashboard/types';
import { TaskSummary } from '@app/tasks/types';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { DataRaw, IndexListOptions, RawColumnKey } from '../data';
import { FiltersOr, RawFilters } from '../filters';
import { Page } from '../pages';
import { GrpcService } from '../services';
import { FiltersServiceInterface } from '../services/filtersService';
import { IndexServiceInterface } from '../services/indexService';

export abstract class AbstractIndexComponent<K extends RawColumnKey, O extends IndexListOptions, F extends RawFilters, D extends DataRaw | TaskSummary, E extends FiltersEnums> {
  private notificationService = inject(NotificationService);
  private iconsService = inject(IconsService);
  private shareUrlService = inject(ShareUrlService);
  private autoRefreshService = inject(AutoRefreshService);

  protected filterService: FiltersServiceInterface<F, E>;
  protected grpcService: GrpcService;
  protected indexService: IndexServiceInterface<K, O>;

  displayedColumns: K[] = [];
  availableColumns: K[] = [];
  lockColumns: boolean = false;
  isLoading = true;
  data: D[] = [];
  total = 0;

  options: O;

  filters: F;

  intervalValue = 10;
  sharableURL = '';

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.autoRefreshService.createInterval(this.interval, this.stopInterval);
  optionsChange: Subject<void> = new Subject<void>();
  subscriptions: Subscription = new Subscription();

  restore(): void {
    this.displayedColumns = this.indexService.restoreColumns();
    this.availableColumns = this.indexService.availableColumns;
    this.lockColumns = this.indexService.restoreLockColumns();
    this.options = this.indexService.restoreOptions();

    this.filters = this.filterService.restoreFilters() as F;

    this.intervalValue = this.indexService.restoreIntervalValue();

    this.sharableURL = this.generateUrl();
  }

  generateUrl() {
    return this.shareUrlService.generateSharableURL(this.options, this.filters as FiltersOr<number, number>);
  }

  saveOptions() {
    this.indexService.saveOptions(this.options);
  }

  saveColumns() {
    this.indexService.saveColumns(this.displayedColumns);
  }

  saveLockColumns() {
    this.indexService.saveLockColumns(this.lockColumns);
  }

  saveIntervalValue() {
    this.indexService.saveIntervalValue(this.intervalValue);
  }

  saveFilters() {
    this.filterService.saveFilters(this.filters);
  }

  columnsLabels() {
    return this.indexService.columnsLabels;
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  getPageIcon(name: Page): string {
    return this.iconsService.getPageIcon(name);
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

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  onColumnsChange(data: K[]) {
    this.displayedColumns = [...data];
    this.saveColumns();
  }

  onColumnsReset() {
    this.displayedColumns = this.indexService.resetColumns();
  }

  onFiltersChange(filters: F) {
    this.filters = filters;

    this.saveFilters();
    this.options.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this.filterService.resetFilters() as F;
    this.options.pageIndex = 0;
    this.refresh.next();
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this.indexService.saveLockColumns(this.lockColumns);
  }

  onOptionsChange() {
    this.optionsChange.next();
  }

  handleNestedKeys(nestedKeys: string, element: {[key: string]: object}) {
    const keys = nestedKeys.split('.');
    let resultObject: {[key: string]: object} = element;
    keys.forEach(key => {
      resultObject = resultObject[key] as unknown as {[key: string]: object};
    });
    return resultObject;
  }

  autoRefreshTooltip() {
    return this.autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  error(message: string) {
    this.notificationService.error(message);
  }

  success(message: string) {
    this.notificationService.success(message);
  }
}