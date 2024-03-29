import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableColumn } from '@app/types/column.type';
import { CustomColumn } from '@app/types/data';
import { TaskStatusColored } from '@app/types/dialog';
import { Page } from '@app/types/pages';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { ManageCustomColumnDialogComponent } from '@components/manage-custom-dialog.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ApplicationsTableComponent } from './components/table.component';
import { SessionsFiltersService } from './services/sessions-filters.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRawColumnKey, SessionRawFilters, SessionRawListOptions } from './types';

@Component({
  selector: 'app-sessions-index',
  templateUrl: './index.component.html',
  styles: [`
app-table-actions-toolbar {
  flex-grow: 1;
}

.filters {
  height: auto;
  min-height: 64px;

  padding: 1rem;
}
  `],
  standalone: true,
  providers: [
    IconsService,
    ShareUrlService,
    QueryParamsService,
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    SessionsIndexService,
    TasksStatusesService,
    TasksIndexService,
    FiltersService,
    TasksFiltersService,
    SessionsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: SessionsFiltersService
    },
    SessionsStatusesService,
    MatDialog,
  ],
  imports: [
    DurationPipe,
    EmptyCellPipe,
    NoWrapDirective,
    CountTasksByStatusComponent,
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    DragDropModule,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    ApplicationsTableComponent
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly #sessionsFiltersService = inject(SessionsFiltersService);
  readonly #dialog = inject(MatDialog);

  displayedColumns: TableColumn<SessionRawColumnKey>[] = [];
  availableColumns: SessionRawColumnKey[] = [];
  displayedColumnsKeys: SessionRawColumnKey[] = [];
  customColumns: CustomColumn[];
  lockColumns: boolean = false;
  columnsLabels: Record<SessionRawColumnKey, string> = {} as unknown as Record<SessionRawColumnKey, string>;

  isLoading = true;
  isLoading$: Subject<boolean> = new BehaviorSubject(true);

  options: SessionRawListOptions;

  filters: SessionRawFilters = [];

  intervalValue = 0;
  sharableURL = '';

  refresh$: Subject<void> = new Subject<void>();
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);

  tasksStatusesColored: TaskStatusColored[] = [];

  subscriptions: Subscription = new Subscription();

  constructor(
    private _iconsService: IconsService,
    private _shareURLService: ShareUrlService,
    private _sessionsIndexService: SessionsIndexService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit() {
    this.displayedColumnsKeys = this._sessionsIndexService.restoreColumns();
    this.availableColumns = this._sessionsIndexService.availableTableColumns.map(column => column.key);
    this.customColumns = this._sessionsIndexService.restoreCustomColumns();
    this.availableColumns.push(...this.customColumns);
    this.lockColumns = this._sessionsIndexService.restoreLockColumns();
    this._sessionsIndexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.updateDisplayedColumns();

    this.options = this._sessionsIndexService.restoreOptions();

    this.filters = this.#sessionsFiltersService.restoreFilters();

    this.intervalValue = this._sessionsIndexService.restoreIntervalValue();

    this.sharableURL = this._shareURLService.generateSharableURL(this.options, this.filters);
  }

  ngAfterViewInit(): void {
    const mergeSubscription = merge(this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    const loadingSubscription = this.isLoading$.subscribe(isLoading => this.isLoading = isLoading);
    this.subscriptions.add(mergeSubscription);
    this.subscriptions.add(loadingSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.displayedColumnsKeys.map(key => {
      if (key.includes('custom.')) {
        const customColumn = key.replaceAll('custom.', '');
        return {
          key: `options.options.${customColumn}`,
          name: customColumn,
          sortable: true,
        };
      } else {
        return this._sessionsIndexService.availableTableColumns.find(column => column.key === key) as TableColumn<SessionRawColumnKey>;
      }
    });
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  getPageIcon(name: Page): string {
    return this._iconsService.getPageIcon(name);
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

    this._sessionsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: SessionRawColumnKey[]) {
    this.displayedColumnsKeys = data;
    this.updateDisplayedColumns();
    this._sessionsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this._sessionsIndexService.resetColumns();
    this.updateDisplayedColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as SessionRawFilters;

    this.#sessionsFiltersService.saveFilters(filters as SessionRawFilters);
    this.options.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this.#sessionsFiltersService.resetFilters();
    this.options.pageIndex = 0;
    this.refresh.next();
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this._sessionsIndexService.saveLockColumns(this.lockColumns);
  }

  autoRefreshTooltip() {
    return this._autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  // onCancel(sessionId: string) {
  //   this._sessionsGrpcService.cancel$(sessionId).subscribe(
  //     () => this.refresh.next(),
  //   );
  // }

  // onClose(sessionId: string) {
  //   this._sessionsGrpcService.close$(sessionId).subscribe(
  //     () => this.refresh.next(),
  //   );
  // }
  // onDelete(sessionId: string) {
  //   this._sessionsGrpcService.delete$(sessionId).subscribe(
  //     () => this.refresh.next(),
  //   );
  // }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  addCustomColumn(): void {
    const dialogRef = this.#dialog.open<ManageCustomColumnDialogComponent, CustomColumn[], CustomColumn[]>(ManageCustomColumnDialogComponent, {
      data: this.customColumns
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.customColumns = result;
        this.availableColumns = this.availableColumns.filter(column => !column.startsWith('custom.'));
        this.availableColumns.push(...result);
        this.displayedColumnsKeys = this.displayedColumnsKeys.filter(column => !column.startsWith('custom.'));
        this.displayedColumnsKeys.push(...result);
        this.updateDisplayedColumns();
        this._sessionsIndexService.saveColumns(this.displayedColumnsKeys);
        this._sessionsIndexService.saveCustomColumns(this.customColumns);
      }
    });
  }
}
