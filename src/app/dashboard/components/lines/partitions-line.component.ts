import { PartitionRaw } from '@aneoconsultingfr/armonik.api.angular';
import { NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap, tap } from 'rxjs';
import { PartitionsTableComponent } from '@app/partitions/components/table.component';
import { PartitionsFiltersService } from '@app/partitions/services/partitions-filters.service';
import { PartitionsGrpcService } from '@app/partitions/services/partitions-grpc.service';
import { PartitionsIndexService } from '@app/partitions/services/partitions-index.service';
import { PartitionRawColumnKey, PartitionRawFiltersOr, PartitionRawListOptions } from '@app/partitions/types';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
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
  selector: 'app-dashboard-partitions-line',
  template: `
<mat-toolbar>
  <mat-toolbar-row>
    <app-table-actions-toolbar
      [loading]="loadPartitionData"
      [refreshTooltip]="autoRefreshTooltip()"
      [intervalValue]="intervalValue"
      [columnsLabels]="columnsLabels()"
      [displayedColumns]="displayedColumns"
      [availableColumns]="availableColumns"
      [lockColumns]="lockColumns"
      (refresh)="onRefresh()"
      (intervalValueChange)="onIntervalValueChange($event)"
      (displayedColumnsChange)="onColumnsChange($event)"
      (resetColumns)="onColumnsReset()"
      (resetFilters)="onFiltersReset()"
      (lockColumnsChange)="onLockColumnsChange()"
    >
      <ng-container extra-menu-items>
        <button mat-menu-item (click)="onEditNameLine(line.name)">
          <mat-icon aria-hidden="true"  [fontIcon]="getIcon('edit')"></mat-icon>
          <span i18n appNoWrap>
            Edit name line
          </span>
        </button>
        <button mat-menu-item (click)="onDeleteLine(line)">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('delete')"></mat-icon>
          <span i18n appNoWrap>
            Delete line
          </span>
        </button>
      </ng-container>
    </app-table-actions-toolbar>
  </mat-toolbar-row>
  <mat-toolbar-row class="filters">
    <app-filters-toolbar [filters]="filters" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>
<app-partitions-table
  [data]="data"
  [filters]="filters"
  [options]="options"
  [total]="total"
  [displayedColumns]="displayedColumns"
  [lockColumns]="lockColumns"
  (optionsChange)="onOptionsChange()"
></app-partitions-table>
  `,
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
    PartitionsGrpcService,
    NotificationService,
    PartitionsIndexService,
    DefaultConfigService,
    MatSnackBar,
    {
      provide: DATA_FILTERS_SERVICE,
      useClass: PartitionsFiltersService
    },
    PartitionsFiltersService
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
    PartitionsTableComponent,
    TableActionsToolbarComponent
  ]
})
export class PartitionsLineComponent implements OnInit, AfterViewInit,OnDestroy {
  readonly #dialog = inject(MatDialog);
  readonly #autoRefreshService = inject(AutoRefreshService);
  readonly #iconsService = inject(IconsService);
  readonly #applicationGrpcService = inject(PartitionsGrpcService);
  readonly #notificationService = inject(NotificationService);
  readonly #applicationsIndexService = inject(PartitionsIndexService);
  readonly #defaultConfigService = inject(DefaultConfigService);

  @Input({ required: true }) line: Line;
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<Line> = new EventEmitter<Line>();

  total: number;
  loadPartitionData = false;
  data: PartitionRaw[] = [];
  filters: PartitionRawFiltersOr;
  options: PartitionRawListOptions;

  displayedColumns: PartitionRawColumnKey[] = [];
  availableColumns: PartitionRawColumnKey[] = [];
  lockColumns: boolean = false;
  intervalValue: number;

  refresh: Subject<void> = new Subject<void>();
  optionsChange: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  subscriptions: Subscription = new Subscription();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);

  ngOnInit(): void {
    this.loadPartitionData = true;
    this.options = (this.line.options as PartitionRawListOptions) ?? this.#defaultConfigService.defaultPartitions.options;
    this.displayedColumns = this.line.displayedColumns as PartitionRawColumnKey[] ?? this.#defaultConfigService.defaultPartitions.columns;
    this.lockColumns = this.line.lockColumns ?? this.#defaultConfigService.defaultPartitions.lockColumns;
    this.availableColumns = this.#applicationsIndexService.availableColumns;
    this.intervalValue = this.line.interval;

    this.filters = this.line.filters as PartitionRawFiltersOr;
    this.interval.next(this.line.interval);
  }

  columnsLabels(): Record<PartitionRawColumnKey, string> {
    return this.#applicationsIndexService.columnsLabels;
  }

  ngAfterViewInit() {
    const mergeSubscription = merge(this.optionsChange, this.refresh, this.interval$).pipe(
      startWith(0),
      tap(() => (this.loadPartitionData = true)),
      switchMap(() => {
        return this.#applicationGrpcService.list$(this.options, this.filters).pipe(catchError((error) => {
          console.error(error);
          this.#notificationService.error('Unable to fetch applications');
          return of(null);
        }));
      }),
      map(data => {
        this.loadPartitionData = false;
        this.total = data?.total ?? 0;

        const partitions = data?.partitions ?? [];

        return partitions;
      })
    ).subscribe(data => {
      this.data = data;
    });

    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

  onOptionsChange() {
    this.line.options = this.options;
    this.optionsChange.next();
    this.lineChange.emit();
  }

  onColumnsChange(data: PartitionRawColumnKey[]) {
    this.displayedColumns = data;
    this.line.displayedColumns = data;
    this.lineChange.emit();
  }

  onColumnsReset() {
    this.displayedColumns = this.#applicationsIndexService.resetColumns();
    this.line.displayedColumns = this.displayedColumns;
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