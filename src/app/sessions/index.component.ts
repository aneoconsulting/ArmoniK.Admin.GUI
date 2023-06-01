import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { AppIndexComponent } from '@app/types/components';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { TableLoadingComponent } from '@components/table-loading.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRaw, SessionRawColumnKey, SessionRawFieldKey, SessionRawFilter, SessionRawFilterField, SessionRawListOptions } from './types';

@Component({
  selector: 'app-sessions-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('sessions')"></mat-icon>
  <span i18n="Page title"> Sessions </span>
</app-page-header>

<mat-toolbar>
  <mat-toolbar-row>
    <app-table-actions-toolbar
      [refreshTooltip]="autoRefreshTooltip()"
      [intervalValue]="intervalValue"
      [columnsLabels]="columnsLabels()"
      [displayedColumns]="displayedColumns"
      [availableColumns]="availableColumns"
      (refresh)="onRefresh()"
      (intervalValueChange)="onIntervalValueChange($event)"
      (displayedColumnsChange)="onColumnsChange($event)"
      (resetColumns)="onColumnsReset()"
      (resetFilters)="onFiltersReset()">
    </app-table-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row>
    <app-filters-toolbar [filters]="filters" [filtersFields]="availableFiltersFields" [columnsLabels]="columnsLabels()" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<app-table-container>
  <app-table-loading [loading]="isLoading"></app-table-loading>
  <table mat-table matSort [matSortActive]="options.sort.active" [matSortDirection]="options.sort.direction" [dataSource]="data" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="onDrop($event)">

    <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
      <!-- Header -->
      <th mat-header-cell mat-sort-header [disabled]="column === 'actions'" *matHeaderCellDef cdkDrag> {{ columnToLabel(column) }} </th>
      <!-- Columns -->
      <ng-container *ngIf="column !== 'actions' && column !== 'sessionId' && column !== 'status' && !dateColumns().includes(column)">
        <td mat-cell *matCellDef="let element">
          <!-- TODO: if it's an array, show the beginning and add a button to view more (using a modal) -->
          <span> {{ element[column] }} </span>
        </td>
      </ng-container>
      <!-- ID -->
      <ng-container *ngIf="column === 'sessionId'">
        <td mat-cell *matCellDef="let element">
          <a mat-button [routerLink]="['/sessions', element[column]]">
            {{ element[column] }}
          </a>
        </td>
      </ng-container>
      <!-- Date -->
      <ng-container *ngIf="dateColumns().includes(column)">
        <td mat-cell *matCellDef="let element">
          {{ columnToDate(element[column]) | date: 'yyyy-MM-dd &nbsp;HH:mm:ss.SSS' }}
        </td>
      </ng-container>
      <!-- Status -->
      <ng-container *ngIf="column === 'status'">
        <td mat-cell *matCellDef="let element">
          <span> {{ statusToLabel(element[column]) }} </span>
        </td>
      </ng-container>
      <!-- Action -->
      <ng-container *ngIf="column === 'actions'">
        <td mat-cell *matCellDef="let element">
          <a mat-icon-button [routerLink]="['/sessions', element.sessionId]" aria-label="See session" matTooltip="See session">
            <mat-icon aria-hidden="true" fontIcon="visibility"></mat-icon>
          </a>
          <button mat-icon-button color="warn" aria-label="Cancel session" matTooltip="Cancel session" (click)="onCancel(element.sessionId)">
            <mat-icon aria-hidden="true" fontIcon="cancel"></mat-icon>
          </button>
        </td>
      </ng-container>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" aria-label="Select page of sessions" i18n-aria-label>
    </mat-paginator>
</app-table-container>
  `,
  styles: [`
app-table-actions-toolbar {
  flex-grow: 1;
}
  `],
  standalone: true,
  providers: [
    SessionsStatusesService,
    IconsService,
    ShareUrlService,
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    SessionsIndexService,
    SessionsGrpcService,
  ],
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    DragDropModule,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    TableLoadingComponent,
    MatTooltipModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy, AppIndexComponent<SessionRaw> {
  displayedColumns: SessionRawColumnKey[] = [];
  availableColumns: SessionRawColumnKey[] = [];

  isLoading = true;
  data: SessionRaw[] = [];
  total = 0;

  options: SessionRawListOptions;

  filters: SessionRawFilter[] = [];
  availableFiltersFields: SessionRawFilterField[] = [];

  intervalValue = 0;
  sharableURL = '';

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  subscriptions: Subscription = new Subscription();

  constructor(
    private _sessionsStatusesService: SessionsStatusesService,
    private _iconsService: IconsService,
    private _shareURLService: ShareUrlService,
    private _sessionsIndexService: SessionsIndexService,
    private _sessionsGrpcService: SessionsGrpcService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit() {
    this.displayedColumns = this._sessionsIndexService.restoreColumns();
    this.availableColumns = this._sessionsIndexService.availableColumns;

    this.options = this._sessionsIndexService.restoreOptions();

    this.availableFiltersFields = this._sessionsIndexService.availableFiltersFields;
    this.filters = this._sessionsIndexService.restoreFilters();

    this.intervalValue = this._sessionsIndexService.restoreIntervalValue();

    this.sharableURL = this._shareURLService.generateSharableURL(this.options, this.filters);
  }

  ngAfterViewInit(): void {
    // If the user change the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    const mergeSubscription = merge(this.sort.sortChange, this.paginator.page, this.refresh, this.interval$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;

          const options: SessionRawListOptions = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sort: {
              active: this.sort.active as SessionRawFieldKey,
              direction: this.sort.direction,
            },
          };
          const filters = this.filters;

          this.sharableURL = this._shareURLService.generateSharableURL(options, filters);
          this._sessionsIndexService.saveOptions(options);

          return this._sessionsGrpcService.list$(options, filters).pipe(catchError((error) => {
            console.error(error);
            // TODO: Error management need to be improved (we can create a snackbar for example)
            return of(null);
          }));
        }),
        map(data => {
          this.isLoading = false;
          this.total = data?.total ?? 0;

          const sessions = data?.sessions ?? [];
          return sessions;
        })
      )
      .subscribe(data => {
        this.data = data;
      });

    this.handleAutoRefreshStart();

    this.subscriptions.add(sortSubscription);
    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  columnsLabels(): Record<SessionRawColumnKey, string> {
    return this._sessionsIndexService.columnsLabels;
  }

  columnToLabel(column: SessionRawColumnKey): string {
    return this._sessionsIndexService.columnToLabel(column);
  }

  columnToDate(element: Timestamp | undefined): Date | null {
    if (!element) {
      return null;
    }

    return element.toDate();
  }

  dateColumns(): SessionRawColumnKey[] {
    return this._sessionsIndexService.dateColumns;
  }

  statusToLabel(status: SessionStatus): string {
    return this._sessionsStatusesService.statusToLabel(status);
  }

  getIcon(name: Page): string {
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

  onColumnsChange(value: SessionRawColumnKey[]) {
    this.displayedColumns = value;

    this._sessionsIndexService.saveColumns(value);
  }

  onColumnsReset() {
    this.displayedColumns = this._sessionsIndexService.resetColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as SessionRawFilter[];

    this._sessionsIndexService.saveFilters(filters as SessionRawFilter[]);
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this._sessionsIndexService.resetFilters();
    this.refresh.next();
  }

  autoRefreshTooltip() {
    return this._autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._sessionsIndexService.saveColumns(this.displayedColumns);
  }

  onCancel(sessionId: string) {
    this._sessionsGrpcService.cancel$(sessionId).subscribe(
      () => this.refresh.next(),
    );
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }
}
