import { NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BehaviorSubject, Observable, Subject, Subscription, merge, } from 'rxjs';
import { ApplicationsTableComponent } from '@app/applications/components/table.component';
import { ApplicationsFiltersService } from '@app/applications/services/applications-filters.service';
import { ApplicationsGrpcService } from '@app/applications/services/applications-grpc.service';
import { ApplicationsIndexService } from '@app/applications/services/applications-index.service';
import { ApplicationRawColumnKey, ApplicationRawFilters, ApplicationRawListOptions } from '@app/applications/types';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableColumn } from '@app/types/column.type';
import { EditNameLineData, EditNameLineResult } from '@app/types/dialog';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { ActionsToolbarComponent } from '../../../components/actions-toolbar.component';
import { AutoRefreshButtonComponent } from '../../../components/auto-refresh-button.component';
import { PageSectionHeaderComponent } from '../../../components/page-section-header.component';
import { PageSectionComponent } from '../../../components/page-section.component';
import { RefreshButtonComponent } from '../../../components/refresh-button.component';
import { SpinnerComponent } from '../../../components/spinner.component';
import { Line } from '../../types';
import { EditNameLineDialogComponent } from '../edit-name-line-dialog.component';
import { StatusesGroupCardComponent } from '../statuses-group-card.component';

@Component({
  selector: 'app-dashboard-applications-line',
  templateUrl: './applications-line.component.html',
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
    ShareUrlService,
    AutoRefreshService,
    ApplicationsGrpcService,
    NotificationService,
    ApplicationsIndexService,
    DefaultConfigService,
    MatSnackBar,
    {
      provide: DATA_FILTERS_SERVICE,
      useClass: ApplicationsFiltersService
    },
    ApplicationsFiltersService
  ],
  imports: [
    PageSectionComponent,
    PageSectionHeaderComponent,
    ActionsToolbarComponent,
    RefreshButtonComponent,
    SpinnerComponent,
    AutoRefreshButtonComponent,
    FiltersToolbarComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    StatusesGroupCardComponent,
    NgIf,
    NgForOf,
    ApplicationsTableComponent,
    TableActionsToolbarComponent
  ]
})
export class ApplicationsLineComponent implements OnInit, AfterViewInit,OnDestroy {
  readonly #dialog = inject(MatDialog);
  readonly #autoRefreshService = inject(AutoRefreshService);
  readonly #iconsService = inject(IconsService);
  readonly #applicationGrpcService = inject(ApplicationsGrpcService);
  readonly #notificationService = inject(NotificationService);
  readonly _applicationsIndexService = inject(ApplicationsIndexService);
  readonly #defaultConfigService = inject(DefaultConfigService);

  @Input({ required: true }) line: Line;
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<Line> = new EventEmitter<Line>();

  loadApplicationData = true;
  loadApplicationData$: Subject<boolean> = new BehaviorSubject(true);
  filters: ApplicationRawFilters;
  options: ApplicationRawListOptions;

  displayedColumnsKeys: ApplicationRawColumnKey[] = [];
  displayedColumns: TableColumn<ApplicationRawColumnKey>[] = [];
  availableColumns: ApplicationRawColumnKey[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<ApplicationRawColumnKey, string> = {} as unknown as Record<ApplicationRawColumnKey, string>;

  intervalValue: number;

  refresh$: Subject<void> = new Subject<void>();
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  subscriptions: Subscription = new Subscription();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);

  ngOnInit(): void {
    this.loadApplicationData = true;
    this.options = (this.line.options as ApplicationRawListOptions) ?? this.#defaultConfigService.defaultApplications.options;
    this.availableColumns = this._applicationsIndexService.availableTableColumns.map(c => c.key);
    this.displayedColumnsKeys = this._applicationsIndexService.restoreColumns();
    this.updateDisplayedColumns();
    this._applicationsIndexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this.line.lockColumns ?? this.#defaultConfigService.defaultApplications.lockColumns;
    this.intervalValue = this.line.interval;

    this.filters = this.line.filters as ApplicationRawFilters;
    this.interval.next(this.line.interval);
  }

  ngAfterViewInit() {
    const mergeSubscription = merge(this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    const loadingSubscription = this.loadApplicationData$.subscribe((value) => this.loadApplicationData = value);
    this.subscriptions.add(mergeSubscription);
    this.subscriptions.add(loadingSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsKeys.map(key => this._applicationsIndexService.availableTableColumns.find(c => c.key === key)).filter(Boolean) as TableColumn<ApplicationRawColumnKey>[];
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  autoRefreshTooltip(): string {
    return this.#autoRefreshService.autoRefreshTooltip(this.line.interval);
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
    this.line.interval = value;

    if(value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this.lineChange.emit();

  }

  onEditNameLine(value: string) {
    const dialogRef: MatDialogRef<EditNameLineDialogComponent, EditNameLineResult> = this.#dialog.open<EditNameLineDialogComponent, EditNameLineData, EditNameLineResult>(EditNameLineDialogComponent, {
      data: {
        name: value
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.line.name = result.name;
        this.lineChange.emit();
      }
    });
  }

  onDeleteLine(value: Line): void {
    this.lineDelete.emit(value);
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as [];
    this.line.filters = value as [];
    this.lineChange.emit();
    this.refresh.next();
  }

  onColumnsChange(data: ApplicationRawColumnKey[]) {
    this.displayedColumnsKeys = data;
    this.updateDisplayedColumns();
    this.line.displayedColumns = data;
    this.lineChange.emit();
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this._applicationsIndexService.resetColumns();
    this.line.displayedColumns = this.displayedColumnsKeys;
    this.updateDisplayedColumns();
    this.lineChange.emit();
  }

  onFiltersReset() {
    this.filters = [];
    this.line.filters = [];
    this.lineChange.emit();
    this.refresh.next();
  }

  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this.line.lockColumns = this.lockColumns;
    this.lineChange.emit();
  }
}